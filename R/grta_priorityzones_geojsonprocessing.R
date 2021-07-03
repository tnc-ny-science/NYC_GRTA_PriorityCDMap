# Load SF Library
library(sf)
library(mapview)
library(here)

here()

#Read data as geojson from URL
nyc_commdistbounds <- st_read("https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/NYC_Community_Districts/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=pgeojson")

# For ease make column names lowercase
names(nyc_commdistbounds) <- tolower(names(nyc_commdistbounds))

# Grab select fields from Community District Profiles
cd_data_trunc <- read.csv("https://planninglabs.carto.com/api/v2/sql?format=csv&q=SELECT%20borocd,cb_website,cd_short_title%20FROM%20community_district_profiles&filename=Bronx-4-indicators.csv")

cd_data_trunc$borocode <- substr(cd_data_trunc$borocd, 1,1)

cd_data_trunc$commdist_int <- as.integer(substr(cd_data_trunc$borocd, 2,3))

cd_data_trunc$boroname <-  as.character(rep(NA, nrow(cd_data_trunc)))

cd_data_trunc[cd_data_trunc$borocode==1, "boroname"] <- "Manhattan"
cd_data_trunc[cd_data_trunc$borocode==2, "boroname"] <- "Bronx"
cd_data_trunc[cd_data_trunc$borocode==3, "boroname"] <- "Brooklyn"
cd_data_trunc[cd_data_trunc$borocode==4, "boroname"] <- "Queens"
cd_data_trunc[cd_data_trunc$borocode==5, "boroname"] <- "Staten Island"

cd_data_trunc$boroname_url <-  as.character(rep(NA, nrow(cd_data_trunc)))

cd_data_trunc[cd_data_trunc$borocode==1, "boroname_url"] <- "manhattan"
cd_data_trunc[cd_data_trunc$borocode==2, "boroname_url"] <- "bronx"
cd_data_trunc[cd_data_trunc$borocode==3, "boroname_url"] <- "brooklyn"
cd_data_trunc[cd_data_trunc$borocode==4, "boroname_url"] <- "queens"
cd_data_trunc[cd_data_trunc$borocode==5, "boroname_url"] <- "staten-island"

cd_data_trunc$profileurl <- paste("https://communityprofiles.planning.nyc.gov", cd_data_trunc$boroname_url, cd_data_trunc$commdist_int, sep="/")

cd_data_trunc$boroname_cd <- paste(cd_data_trunc$boroname, cd_data_trunc$commdist_int, sep=" ")

cd_data_trunc$boroname <- NULL
cd_data_trunc$boroname_url <- NULL
cd_data_trunc$commdist_int <- NULL
cd_data_trunc$borocode <- NULL


# Create column for GRTA Priority Area
nyc_commdistbounds$"Tax Abatement Priority Area" <- as.character(rep(NA, nrow(nyc_commdistbounds)))
nyc_commdistbounds$grta_priority <- as.character(rep(NA, nrow(nyc_commdistbounds)))



# Create Vector of Priority priority districts - need to double/triple check but from here: https://www1.nyc.gov/site/sustainability/legislation/legislation-rules.page
priority_districts <- c("316","206","202","303","203","305","201","304","317","205","211","308","309","110","204")

# If borocd in priority district vector, code as Yes
nyc_commdistbounds[nyc_commdistbounds$borocd %in% priority_districts, "Tax Abatement Priority Area"] <- "Yes"
nyc_commdistbounds[nyc_commdistbounds$borocd %in% priority_districts, "grta_priority"] <- "Yes"


# If borocd NOT priority district vector, code as NO (based on the previous)
nyc_commdistbounds[is.na(nyc_commdistbounds$grta_priority), "Tax Abatement Priority Area"] <- "No"
nyc_commdistbounds[is.na(nyc_commdistbounds$grta_priority), "grta_priority"] <- "No"

# Merge Comm Dist Profile Data with spatial data + priority area information
# Note - unpopulated CDs are dropped
nyc_commdist_data <- merge(nyc_commdistbounds, cd_data_trunc, all.y=TRUE)

# Get rid of unnecessary columns
nyc_commdist_data$objectid <- NULL
nyc_commdist_data$shape__area <- NULL
nyc_commdist_data$shape__length <- NULL
nyc_commdist_data$cd_short_title <- NULL


# Use Mapview to make sure things look right
mapview(nyc_commdist_data, zcol="grta_priority")

# Write data out
st_write(nyc_commdist_data, here("../data/nyc_commdists_grta_priority.geojson"))
