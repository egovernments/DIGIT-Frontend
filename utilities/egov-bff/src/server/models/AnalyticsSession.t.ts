export interface AnalyticsSession {
    sessionId:         string;
    userId:            string;
    domain:            string;
    application:       string;
    deviceDetails:     DeviceDetails;
    sessionDetails:    SessionDetails;
    location:          Location;
    customAttributes:  CustomAttributes;
    additionalDetails: AdditionalDetails;
}

export interface AdditionalDetails {
}

export interface CustomAttributes {
    userRole:         string;
    userlocale:       string;
    featureUsage:     string;
    conversionStatus: boolean;
}

export interface DeviceDetails {
    deviceType: string;
    browser:    string;
    os:         string;
    resolution: string;
}

export interface Location {
    ipHash:   string;
    country:  string;
    region:   string;
    city:     string;
    timezone: string;
}

export interface SessionDetails {
    sessionStart:    Date;
    entryPage:       string;
    sessionDuration: number;
    pageViews:       number;
    sessionEnd:      Date;
    exitPage:        string;
}