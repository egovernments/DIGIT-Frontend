export interface AnalyticsEvent {
    eventId:            string;
    eventType:          string;
    eventTimestamp:     Date;
    sessionId:          string;
    pageUrl:            string;
    referrerUrl:        string;
    interaction:        Interaction;
    performanceMetrics: PerformanceMetrics;
}

export interface Interaction {
    interactionType: string;
    elementId:       string;
    elementClass:    string;
}

export interface PerformanceMetrics {
    pageLoadTime:      number;
    apiResponseTime:   number;
    resourceLoadTime:  number;
    errorLogs:         string[];
    additionalDetails: AdditionalDetails;
}

export interface AdditionalDetails {
}
