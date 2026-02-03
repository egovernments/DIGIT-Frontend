# @egovernments/digit-ui-module-open-payment

## Version: 0.1.0 🎉 NEW MODULE
**Release Date:** October 23, 2025

## 📦 Installation

```bash
npm install --save @egovernments/digit-ui-module-open-payment@0.1.0
```

## 🎉 What's New - Complete Payment Gateway System

### 🏗️ Brand New Module
This is a **completely new module** providing a comprehensive payment gateway system for DIGIT platform with support for external payment processors and multi-tenant payment handling.

### 🚀 Major Features
- **💳 Core Payment Components**: OpenSearch, OpenView, Response handling
- **🔗 PayGov Integration**: External payment gateway support with secure handling
- **⚙️ Advanced Configuration**: Comprehensive search and payment configurations
- **🏢 Multi-Tenant Support**: Full tenant-specific payment processing
- **🔐 Secure Processing**: Cross-origin handling and security compliance

## 📋 Core Features

### 💳 Payment Components
1. **OpenSearch Component**
   - Advanced payment search functionality
   - Dynamic tenant selection with MDMS integration
   - Connection ID based search with billing service integration
   - Configurable search forms with validation
   - Enhanced error handling and user feedback

2. **OpenView Component**
   - Comprehensive payment view interface
   - Detailed payment information display
   - Status tracking and history visualization
   - Enhanced user experience for payment details

3. **Response Component**
   - Payment response handling for success/failure scenarios
   - Better user feedback and next steps guidance
   - Enhanced error reporting and troubleshooting
   - Redirect handling for external gateways

### ⚙️ Configuration System
4. **OpenSearchConfig**
   - Billing service integration (`/billing-service/bill/v2/_fetchbill`)
   - Configurable search parameters and validation
   - MDMS-based dropdown options for tenant selection
   - Flexible form field configuration with localization support
   - Advanced search criteria with connection ID lookup

5. **UICustomizations**
   - Tailored user interface for payment workflows
   - Enhanced component styling and behavior
   - Custom validation and interaction patterns

### 🔧 Payment Utilities & Integration
6. **PayGov Integration**
   - `makePayment` function for external payment gateway integration
   - Cross-origin request handling with proper headers
   - No-cors mode support for payment gateway compatibility
   - Enhanced error handling and response management

7. **Hooks Integration**
   - Custom hooks for payment operations
   - Better state management for payment flows
   - Enhanced data fetching and caching
   - Improved error handling and loading states

### 👤 Citizen Portal
8. **Citizen Interface**
   - Complete citizen-facing payment interface
   - Enhanced user experience for citizen payments
   - Better mobile responsiveness and accessibility
   - Streamlined payment workflows and navigation

## 🔧 Configuration System

The Open Payment module supports a comprehensive configuration system with multiple configuration types for payment gateway integration and transaction management.

### 1. Global Configuration (globalConfigs.getConfig)

Global configurations that affect the entire open payment module behavior:

| Config Key | Type | Default | Description | Usage |
|------------|------|---------|-------------|--------|
| `OVERRIDE_ROOT_TENANT_WITH_LOGGEDIN_TENANT` | Boolean | `false` | Multi-tenant support for payment operations | Tenant context switching in payments |
| `MULTI_ROOT_TENANT` | Boolean | `false` | Enables multi-root tenant support | Enhanced tenant payment management |
| `PAYMENT_GATEWAY_URL` | String | - | External payment gateway URL | PayGov and other gateway integration |
| `BILLING_SERVICE_URL` | String | - | Billing service endpoint | Payment search and bill fetching |
| `PAYMENT_TIMEOUT` | Number | `30000` | Payment gateway timeout in ms | Transaction timeout handling |
| `PAYMENT_RETRY_COUNT` | Number | `3` | Maximum retry attempts for failed payments | Error handling |
| `PAYMENT_ENCRYPTION_ENABLED` | Boolean | `true` | Enable payment data encryption | Security compliance |

```javascript
// Global Configuration Example
const getConfig = (key) => {
  switch(key) {
    case 'OVERRIDE_ROOT_TENANT_WITH_LOGGEDIN_TENANT':
      return true; // Enable multi-tenant payments
    case 'MULTI_ROOT_TENANT':
      return true; // Enable multi-root tenant support
    case 'PAYMENT_GATEWAY_URL':
      return 'https://paygov.example.com'; // Set payment gateway URL
    case 'BILLING_SERVICE_URL':
      return '/billing-service'; // Set billing service endpoint
    case 'PAYMENT_TIMEOUT':
      return 60000; // Set timeout to 60 seconds
    case 'PAYMENT_RETRY_COUNT':
      return 5; // Allow 5 retry attempts
    case 'PAYMENT_ENCRYPTION_ENABLED':
      return true; // Enable encryption
    default:
      return undefined;
  }
};
```

### 2. Component Props Configuration

Direct configuration passed as props to payment components:

```javascript
// OpenSearch Component Configuration
<OpenSearch
  config={{
    searchCriteria: ["connectionId", "billNumber", "consumerCode"],
    tenantFilter: true,
    dateRangeFilter: true,
    statusFilter: ["pending", "paid", "failed"],
    maxResults: 100,
    enableExport: true
  }}
  onSearch={handlePaymentSearch}
  tenantId="pg.citya"
/>

// OpenView Component Configuration
<OpenView
  config={{
    showPaymentHistory: true,
    showReceiptDownload: true,
    showPrintOption: true,
    enablePartialPayment: false,
    paymentMethods: ["gateway", "cash", "cheque"],
    receiptFormat: "standard"
  }}
  paymentData={paymentDetails}
  onAction={handlePaymentAction}
/>

// Response Component Configuration
<Response
  config={{
    redirectTimeout: 5000,
    showTransactionDetails: true,
    enableRetry: true,
    showReceiptPreview: true,
    autoRedirectOnSuccess: true,
    errorRetryLimit: 3
  }}
  transactionId="TXN123456"
  status="success"
/>
```

### 3. MDMS Configuration

Configuration stored in MDMS for dynamic payment behavior:

```json
{
  "tenantId": "pg",
  "moduleName": "open-payment-config",
  "PaymentConfig": [
    {
      "module": "PaymentGateway",
      "config": {
        "supportedGateways": [
          {
            "code": "paygov",
            "name": "PayGov",
            "url": "https://paygov.treasury.gov",
            "timeout": 30000,
            "retryCount": 3
          },
          {
            "code": "razorpay",
            "name": "Razorpay",
            "url": "https://api.razorpay.com",
            "timeout": 45000,
            "retryCount": 2
          }
        ],
        "defaultGateway": "paygov",
        "encryptionRequired": true
      }
    },
    {
      "module": "BillingIntegration",
      "config": {
        "billingServiceUrl": "/billing-service/bill/v2/_fetchbill",
        "searchCriteria": {
          "connectionId": {
            "mandatory": true,
            "validation": "^[A-Z0-9]+$"
          },
          "billNumber": {
            "mandatory": false,
            "validation": "^[0-9]+$"
          }
        },
        "resultLimit": 50
      }
    },
    {
      "module": "TransactionManagement",
      "config": {
        "transactionStates": ["initiated", "processing", "success", "failed", "cancelled"],
        "timeoutDuration": 300000,
        "receiptGeneration": {
          "autoGenerate": true,
          "format": "pdf",
          "template": "standard"
        }
      }
    }
  ]
}
```

### 4. UI Customizations (Digit.Customizations)

Customizations for payment components and workflows:

```javascript
// Open Payment Module Customizations
Digit.Customizations = {
  "open-payment": {
    "OpenSearch": {
      "searchForm": {
        "fields": [
          {
            "key": "connectionId",
            "label": "Connection ID",
            "type": "text",
            "validation": ["required", "alphanumeric"],
            "placeholder": "Enter Connection ID"
          },
          {
            "key": "billNumber",
            "label": "Bill Number",
            "type": "text",
            "validation": ["numeric"],
            "placeholder": "Enter Bill Number"
          },
          {
            "key": "dateRange",
            "label": "Bill Date Range",
            "type": "daterange",
            "validation": ["dateRange"]
          }
        ],
        "submitButton": {
          "text": "Search Bills",
          "loading": "Searching...",
          "disabled": false
        }
      },
      "resultTable": {
        "columns": [
          {
            "key": "billNumber",
            "label": "Bill Number",
            "sortable": true,
            "searchable": true
          },
          {
            "key": "amount",
            "label": "Amount",
            "formatter": "currency",
            "sortable": true
          },
          {
            "key": "dueDate",
            "label": "Due Date",
            "formatter": "date",
            "sortable": true
          },
          {
            "key": "status",
            "label": "Status",
            "formatter": "status"
          }
        ],
        "actions": [
          {
            "key": "pay",
            "label": "Pay Now",
            "icon": "payment",
            "primary": true
          },
          {
            "key": "view",
            "label": "View Details",
            "icon": "view"
          }
        ]
      }
    },
    "PaymentGateway": {
      "gatewaySelection": {
        "showGatewayLogos": true,
        "allowGatewaySwitch": true,
        "defaultGateway": "paygov",
        "gatewayFeatures": {
          "paygov": {
            "name": "Pay.gov",
            "logo": "/assets/paygov-logo.png",
            "features": ["secure", "government", "instant"]
          },
          "razorpay": {
            "name": "Razorpay",
            "logo": "/assets/razorpay-logo.png",
            "features": ["multiple_methods", "fast", "reliable"]
          }
        }
      },
      "paymentForm": {
        "fields": [
          {
            "key": "amount",
            "label": "Payment Amount",
            "type": "currency",
            "readonly": true
          },
          {
            "key": "paymentMethod",
            "label": "Payment Method",
            "type": "select",
            "options": ["card", "netbanking", "upi", "wallet"]
          }
        ],
        "securityFeatures": {
          "showSecurityBadges": true,
          "encryptionNotice": true,
          "sslIndicator": true
        }
      }
    },
    "PaymentResponse": {
      "successPage": {
        "showReceiptPreview": true,
        "downloadOptions": ["pdf", "email"],
        "redirectOptions": {
          "autoRedirect": true,
          "redirectDelay": 5000,
          "showCountdown": true
        },
        "socialSharing": {
          "enabled": false,
          "platforms": ["email", "sms"]
        }
      },
      "failurePage": {
        "showErrorDetails": true,
        "retryOptions": {
          "enableRetry": true,
          "maxRetries": 3,
          "retryMethods": ["same_gateway", "different_gateway"]
        },
        "supportContact": {
          "showHelpdesk": true,
          "phone": "1800-XXX-XXXX",
          "email": "support@example.com"
        }
      }
    },
    "TransactionTracking": {
      "trackingDisplay": {
        "showTimeline": true,
        "showStatusUpdates": true,
        "enableNotifications": true,
        "updateInterval": 30000
      },
      "transactionDetails": {
        "showTransactionId": true,
        "showTimestamp": true,
        "showGatewayReference": true,
        "showPaymentMethod": true
      }
    }
  }
};
```

## 💻 Usage

### Basic Setup

Add the dependency to your `package.json`:

```json
{
  "@egovernments/digit-ui-module-open-payment": "^0.1.0"
}
```

### In your App.js

```jsx
import { initOpenPaymentComponents } from "@egovernments/digit-ui-module-open-payment";

// Enable open payment module
const enabledModules = ["open-payment"];

// Initialize open payment components
const initDigitUI = () => {
  initOpenPaymentComponents();
};
```

### Using Payment Components

```jsx
// Payment Search Component
import { OpenSearch } from "@egovernments/digit-ui-module-open-payment";

<OpenSearch
  onSearch={handlePaymentSearch}
  tenantId="pg.citya"
  config={searchConfig}
/>

// Payment View Component
import { OpenView } from "@egovernments/digit-ui-module-open-payment";

<OpenView
  paymentData={paymentDetails}
  onAction={handlePaymentAction}
  showHistory={true}
/>

// Payment Response Handler
import { Response } from "@egovernments/digit-ui-module-open-payment";

<Response
  transactionId="TXN123456"
  status="success"
  onContinue={handleContinue}
/>
```

### Using PayGov Integration

```jsx
import { makePayment } from "@egovernments/digit-ui-module-open-payment";

// External payment processing
const processPayment = async (paymentData) => {
  try {
    await makePayment(
      'https://paygov.example.com/process',
      paymentData
    );
  } catch (error) {
    console.error('Payment failed:', error);
  }
};
```

### MDMS Configuration

Enable open payment in MDMS by adding this configuration:

```json
{
  "module": "open-payment",
  "code": "open-payment",
  "active": true,
  "order": 1,
  "tenants": [
    {
      "code": "your-tenant-code"
    }
  ]
}
```

## 🏗️ Architecture & Components

### 📄 Configuration Files
- **OpenSearchConfig.js**: Comprehensive search configuration with billing service integration
- **UICustomizations.js**: Custom UI behavior and styling for payment workflows

### 🛠️ Utility Systems
- **payGov.js**: PayGov integration utilities for external payment processing
- **index.js**: Centralized utility exports and payment helpers

### 🔄 Page Structure
- **Citizen Index**: Complete citizen-facing payment interface
- **Employee Interface**: Administrative payment management tools

## 🎯 Key Capabilities

### 💳 Payment Gateway Features
- **External Gateway Support**: PayGov integration for government payments
- **Secure Processing**: Proper headers and cross-origin handling
- **Multiple Gateways**: Support for various payment processors
- **Transaction Tracking**: Complete payment lifecycle management

### 🔍 Payment Search & Management
- **Advanced Search**: Connection ID based payment lookup
- **Tenant-Specific**: Filtering based on tenant context
- **Bill Integration**: Direct integration with billing service
- **History Tracking**: Complete payment history and audit trails

### 🏢 Multi-Tenant Support
- **Tenant Isolation**: Proper separation of payment data
- **Configuration Management**: Tenant-specific payment settings
- **Gateway Selection**: Different gateways per tenant
- **Compliance**: Tenant-specific compliance requirements

### 🔐 Security & Compliance
- **Secure Headers**: Proper security headers for payment processing
- **Data Protection**: Encrypted payment data handling
- **Compliance**: PCI DSS and government payment standards
- **Audit Trails**: Complete audit logs for payment transactions

## 🎨 User Interface

### 🖥️ Responsive Design
- **Mobile-First**: Optimized for mobile payment flows
- **Touch Friendly**: Enhanced touch interactions for payments
- **Accessibility**: WCAG compliant payment forms
- **Cross-Browser**: Tested across major browsers

### 🎯 User Experience
- **Simplified Flow**: Streamlined payment process
- **Clear Feedback**: Real-time status updates
- **Error Handling**: User-friendly error messages
- **Progress Tracking**: Visual payment progress indicators

## 🔄 Payment Flow

### Citizen Payment Flow
1. **Search**: Find bills/payments using connection ID
2. **Select**: Choose payments to process
3. **Gateway**: Redirect to external payment gateway
4. **Process**: Complete payment on gateway
5. **Response**: Handle success/failure response
6. **Confirmation**: Display payment confirmation

### Administrative Flow
1. **Monitor**: Track payment transactions
2. **Reconcile**: Match payments with bills
3. **Report**: Generate payment reports
4. **Audit**: Review payment audit trails

## 🧪 Testing

### Payment Testing
```javascript
// Enable payment testing features
window.globalConfigs.getConfig = (key) => {
  if (key === 'OVERRIDE_ROOT_TENANT_WITH_LOGGEDIN_TENANT') return true;
  if (key === 'PAYMENT_GATEWAY_URL') return 'https://test-gateway.com';
};
```

### Feature Testing Checklist
- [ ] Payment search functionality works
- [ ] Tenant selection and filtering
- [ ] External gateway integration
- [ ] Payment response handling
- [ ] Multi-tenant payment processing
- [ ] Mobile payment flow

## 🔗 Dependencies

### Required Dependencies
- `@egovernments/digit-ui-react-components`: ^1.8.0
- `@egovernments/digit-ui-components`: ^1.0.0
- `react`: ^17.0.2
- `react-dom`: ^17.0.2

### External Integrations
- **Billing Service**: For payment search and bill fetching
- **Payment Gateways**: PayGov and other external processors
- **MDMS**: For tenant and configuration management

## 🔧 Payment Gateway Integration

### PayGov Integration
```javascript
import { makePayment } from "@egovernments/digit-ui-module-open-payment";

const paymentData = new FormData();
paymentData.append('amount', '1000.00');
paymentData.append('currency', 'USD');
paymentData.append('reference', 'REF123');

await makePayment(
  'https://paygov.treasury.gov/process',
  paymentData
);
```

### Custom Gateway Integration
```javascript
// Extend for other gateways
const customGatewayPayment = async (gatewayUrl, paymentData) => {
  const response = await fetch(gatewayUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer token'
    },
    body: JSON.stringify(paymentData)
  });
  return response.json();
};
```

## 🐛 Known Issues & Solutions

### Common Issues
1. **CORS Errors**: Ensure proper CORS configuration for payment gateways
2. **Gateway Timeout**: Implement proper timeout handling
3. **Payment Failures**: Proper error handling and retry mechanisms
4. **Mobile Issues**: Test payment flows on mobile devices

## 📊 Performance & Security

### Performance
- **Fast Search**: Optimized payment search queries
- **Efficient Loading**: Lazy loading of payment data
- **Caching**: Intelligent caching of payment information
- **Bundle Size**: Optimized bundle for production

### Security
- **PCI Compliance**: Follows PCI DSS standards
- **Data Encryption**: Encrypted payment data transmission
- **Secure Headers**: Proper security headers
- **Audit Logging**: Complete audit trails

## 🤝 Contributors

- [jagankumar-egov](https://github.com/jagankumar-egov)

## 📚 Documentation

- [Developer Guide](https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui)
- [Payment Gateway Guide](https://core.digit.org/guides/developer-guide/payment-gateway-integration)
- [API Documentation](https://core.digit.org/platform/core-services/billing-service)

## 🔧 Maintainer

- [jagankumar-egov](https://www.github.com/jagankumar-egov)

## 📄 License

MIT

---

### Published from DIGIT Frontend
[DIGIT Frontend Repository](https://github.com/egovernments/DIGIT-Frontend/tree/develop)

![DIGIT Logo](https://s3.ap-south-1.amazonaws.com/works-dev-asset/mseva-white-logo.png)