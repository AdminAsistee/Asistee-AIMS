## CORE VITAL FUNCTIONS:
Guests SEARCHES_FOR Properties ON BookingSites

Investor OWNS property LISTED_ON BookingSite

Guest MAKES Booking ON BookingSite AT Property FOR DateRange

Guest MESSAGES Messenger(within PropertyManager) THROUGH Booking

Guest PAYS_FOR Booking TO Investor THROUGH BookingSite

Booking MAKES Cleaning AT Property ON DateRange.EndDate WHEN CREATED

PropertyManager OVERSEES [Bookings, Messaging(within Booking), Property, Listing(Property X BookingSite)]

CleaningCompany OVERSEES Cleanings

Investor PAYS Amount TO [PropertyManager, CleaningCompany, Accounting]


## IMPORTANT FUNCTIONS:
Accountant OVERSEES Accounting

ChannelManagerSoftware ACTS_AS_MIDDLEWARE_FOR [Property, BookingSite] THROUGH Bookings

PropertyManager PAYS Amount TO [Messenger, ad-hocSupporters, OfficeStaff]

CleaningCompany PAYS Amount TO [Messenger, OfficeStaff]

CleaningCompany TRACKS [Supplies,linens(within Supplies)]

PropertyManager TRACKS ad-hocServices

Cleaner RESETS Room

Messenger ASSURES Guests.Experience


## NICE FUNCTIONS:
Investor HAS_MANY Properties

Properties HAS_MANY BookingSites

[Property, BookingSite] HAS_MANY Listings

Auto-Messenger MESSAGES Guests

Auto-Pricer UPDATES Pricing ON Listings
