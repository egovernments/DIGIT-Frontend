
# DIGIT UI Components

A comprehensive React component library for DIGIT platform applications, providing standardized UI components, form composers, and search interfaces.

## 📦 Install

```bash
npm install --save @egovernments/digit-ui-components
```

**Latest Version: 0.2.1** 🎉

## 🚀 What's New in v0.2.1

### 🔄 InboxSearchComposer Enhancements

#### 1. **Enhanced Table Component**
- Replaced old table with **ResultsDataTable** using react-data-table-component (v7.6.2)
- Features: sorting, filtering, selection, pagination, and expandable rows
- Better performance and customization options

#### 2. **Link Column Support**
```jsx
{
  label: "Id",
  jsonPath: "id", 
  link: true, // Creates clickable links
  buttonProps: {
    size: "medium",
    icon: "Edit",
    linkTo: "/edit-page" // Optional: direct navigation
  }
}
```

#### 3. **Row Selection & Actions**
```jsx
// Row selection configuration
selectionProps: {
  showCheckBox: true,
  showSelectedState: true,
  selectableRowsNoSelectAll: false,
  showSelectedStatePosition: "top" // or "bottom"
}

// Action buttons for selected rows
actionProps: {
  actions: [
    { label: "Edit", variation: "secondary", icon: "Edit" },
    { label: "Delete", variation: "primary", icon: "Delete" }
  ]
}
```

#### 4. **Footer Actions**
```jsx
footerProps: {
  showFooter: true,
  allowedRolesForFooter: ["ADMIN"],
  actionFields: [
    { 
      label: "Previous", 
      icon: "ArrowBack", 
      variation: "secondary",
      allowedRoles: ["USER"] 
    },
    { 
      label: "Next", 
      icon: "ArrowForward", 
      variation: "primary",
      allowedRoles: ["ADMIN"] 
    }
  ],
  setactionFieldsToRight: true
}
```

#### 5. **Expandable Rows**
```jsx
const ExpandedComponent = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);

expandableProps: {
  expandableRows: true,
  expandableRowsComponent: ExpandedComponent
}
```

#### 6. **Editable Tables**
- **Inline Editing:** Edit fields directly within table rows
- **Popup Editing:** Edit in modal with additional fields
- **Field Validation:** FieldV1 configurations for consistency

```jsx
// Inline editable column
{
  label: "Name",
  jsonPath: "data.name",
  editable: true,
  editableFieldConfig: {
    type: "text",
    validation: { minlength: 2 },
    populators: { name: "row.name" }
  }
}

// Additional popup fields
additionalPopupColumns: [
  {
    label: "Description",
    jsonPath: "data.description", 
    editable: true,
    editableFieldConfig: {
      type: "textarea",
      populators: { name: "row.description" }
    }
  }
]
```

#### 7. **UICustomizations Handlers**
Enhanced event handling through UICustomizations:

```jsx
// Handle link column clicks
linkColumnHandler: (row) => {
  const url = `/${window.contextPath}/employee/view?id=${row?.id}`;
  window.location.href = url;
},

// Handle row selections
selectionHandler: (event) => {
  const { allSelected, selectedCount, selectedRows } = event;
  console.log('Selected:', selectedCount, 'rows');
},

// Handle action button clicks
actionSelectHandler: (index, label, selectedRows) => {
  if (label === "Delete") {
    // Handle delete action
  }
},

// Handle footer action clicks  
footerActionHandler: (index, event) => {
  console.log('Footer action:', index, event);
}
```

### 🎯 FormComposer Enhancements

#### 1. **Extended Field Types**
Now supports 20+ field types:
```jsx
// New field types added
"text", "date", "time", "geolocation", "password", 
"search", "number", "numeric", "textarea", "radio", 
"dropdown", "select", "radioordropdown", "toggle", 
"checkbox", "multiselectdropdown", "mobileNumber",
"component", "custom", "amount", "locationdropdown", 
"apidropdown", "dateRange"
```

#### 2. **Boundary Dropdowns (Dependent Dropdowns)**
```jsx
{
  type: "boundary",
  label: "Administrative Area",
  populators: {
    name: "boundary",
    levelConfig: {
      lowestLevel: "VILLAGE",
      highestLevel: "STATE",
      isSingleSelect: ["STATE"] // Single selection for state level
    },
    hierarchyType: "ADMIN_BOUNDARY",
    layoutConfig: {
      isDropdownLayoutHorizontal: true,
      isLabelFieldLayoutHorizontal: false  
    },
    preSelected: ["STATE_001", "DISTRICT_001"], // Pre-fill values
    frozenData: [ // Locked selections
      { code: "STATE_001", name: "State 1" }
    ]
  }
}
```

### 🎨 Major Enhancements
- **🌍 Boundary Dropdowns** for hierarchical administrative boundary selection
- **📊 Editable Tables** with inline editing and popup functionality
- **🎨 Improved Typography & Styling** with responsive design updates
- **🔧 Better Component Variants** for increased flexibility

### Breaking Changes
- **MDMS v2 Integration** - Updated prop formats required
- **Pagination Updates** - Enhanced pagination implementation
- **Employee → UserType** - Configuration property updates
- **Custom Row Components** - New structure requirements

📖 **[Migration Guide](./migration/v0.2.0-to-v0.2.1-migration-guide.md)** - Complete guide for upgrading from v0.2.0

## 🎯 Usage

### Installation

Add the dependency to your package.json:

```json
"@egovernments/digit-ui-components": "0.2.1"
```

### Basic Import

```jsx
// Import individual components
import { Button, TextInput, FormComposerV2, InboxSearchComposer } from "@egovernments/digit-ui-components";

// Import SVG icons
import { SVG } from "@egovernments/digit-ui-components";

// Usage
<Button variant="primary">Click Me</Button>
<SVG.Accessibility />
```

### Component Categories

#### 🔧 **Atoms** (Basic Components)
- Button, TextInput, Toggle, Tag, RadioButtons, OTPInput
- Dropdown, MultiSelectDropdown, CheckBox, Chip
- Loader, Toast, Timeline, Stepper, and more

#### 🧩 **Molecules** (Composite Components)  
- CustomDropdown, ApiDropdown, ResultsDataTable
- FilterCard, SummaryCard, FormCard, PanelCard
- Header, Footer, SideNav, BottomSheet

#### 🎯 **HOCs** (Higher Order Components)
- **FormComposerV2** - Dynamic form builder
- **InboxSearchComposer** - Search & inbox interfaces  
- **BoundaryFilter** - Hierarchical boundary selection

## 📋 Quick Start Examples

### FormComposer Usage
```jsx
import { FormComposerV2 } from "@egovernments/digit-ui-components";

const formConfig = {
  head: "User Details",
  body: [
    {
      type: "text",
      label: "Name",
      isMandatory: true,
      populators: { name: "userName" }
    },
    {
      type: "boundary", // New boundary dropdown
      label: "Location",
      populators: {
        name: "location",
        hierarchyType: "ADMIN",
        levelConfig: {
          lowestLevel: "LOCALITY",
          highestLevel: "STATE"
        }
      }
    }
  ]
};

<FormComposerV2 
  config={[formConfig]} 
  onSubmit={handleSubmit}
  defaultValues={defaultData}
/>
```

### InboxSearchComposer Usage
```jsx
import { InboxSearchComposer } from "@egovernments/digit-ui-components";

const searchConfig = {
  headerLabel: "Search Applications", // Updated from 'label'
  type: "search",
  actions: { // Updated structure
    actionLabel: "Create New",
    actionRoles: ["ADMIN"],
    actionLink: "/create"
  },
  // ... rest of config
};

<div className="digit-inbox-search-wrapper">
  <InboxSearchComposer configs={searchConfig} />
</div>
```

## 🛠️ Local Development

### Prerequisites
- Node.js 14+ 
- Yarn package manager

### Setup Storybook

```bash
# Step 1: Install dependencies
yarn install 

# Step 2: Start Storybook
yarn storybook 
```

## 🔄 Migration & Version History

### **v0.2.1** (Current) - 2025-10-23

#### ✨ Major Features
- **Enhanced FormComposer & InboxSearchComposer** with improved config structure
- **Boundary Dropdowns** for hierarchical selection (Country → State → City)
- **Editable Tables** with inline editing and popup functionality
- **Footer Actions** support in InboxSearchComposer
- **Custom Row Components** in ResultsDataTable

#### 🐛 Key Fixes
- Fixed pagination issues in InboxSearchComposer  
- Resolved dropdown text clearing after re-render
- Fixed multiple API call prevention
- Improved error handling across components

#### ⚠️ Breaking Changes
- `label` → `headerLabel` in InboxSearchComposer configs
- `employee` → `userType` in actionLink configurations
- MDMS v2 prop format requirements
- Enhanced pagination implementation

**📖 [Full Migration Guide](./migration/v0.2.0-to-v0.2.1-migration-guide.md)**

### **v0.2.0** - Previous Major Release

#### New Components Added
- Error Message, Info Button, Panels, Popup Components
- Stepper, TextBlock, Timeline Components  
- Uploader variants (UploadFile, UploadPopup, UploadImage)
- PanelCard Molecule

#### Enhancements
- Updated Button & Dropdown Component Styles
- Toast animations and new `type` prop
- Typography updates with lineHeight
- Enhanced Color Typography

### Migration Examples

#### Toast Component (v0.2.0 Breaking Change)
```jsx
// ❌ Old Usage (pre v0.2.0)
<Toast info={true} label={"Info Toast"} />
<Toast warning="warning" label={"Warning Toast"}/>

// ✅ New Usage (v0.2.0+)
<Toast type="info" label={"Info Toast"} />
<Toast type="warning" label={"Warning Toast"} />
<Toast type="success" label={"Success Toast"} />
```

#### InboxSearchComposer Config (v0.2.1 Breaking Change)
```jsx
// ❌ Old Config (v0.2.0)
const oldConfig = {
  label: "Search Applications",
  actionLabel: "Create",
  actionRoles: ["ADMIN"]
};

// ✅ New Config (v0.2.1)
const newConfig = {
  headerLabel: "Search Applications", // Changed from 'label'
  actions: { // Grouped under 'actions'
    actionLabel: "Create",
    actionRoles: ["ADMIN"],
    actionLink: "/create"
  }
};
```

## 📖 Documentation & Resources

### 📚 **Documentation**
- **[Full Documentation](./DOCUMENTATION.md)** - Comprehensive component documentation
- **[Migration Guide](./migration/v0.2.0-to-v0.2.1-migration-guide.md)** - Step-by-step upgrade instructions
- **[Changelog](./CHANGELOG.md)** - Detailed version history and changes

### 📋 **Sample Configurations & Examples**
- **[Sample Configs](https://github.com/egovernments/DIGIT-Frontend/tree/sample/micro-ui/web/micro-ui-internals/packages/modules/sample/src/configs/uiComponentsConfigs)** - Complete configuration examples
- **[Sample Module Screens](https://github.com/egovernments/DIGIT-Frontend/tree/sample/micro-ui/web/micro-ui-internals/packages/modules/sample)** - Integration examples with new components
- **[Boundary Dropdown Examples](https://github.com/egovernments/DIGIT-Frontend/blob/sample/micro-ui/web/micro-ui-internals/packages/modules/sample/src/configs/uiComponentsConfigs/boundaryConfig.js)** - Dependent dropdown configurations
- **[Editable Table Examples](https://github.com/egovernments/DIGIT-Frontend/blob/sample/micro-ui/web/micro-ui-internals/packages/modules/sample/src/configs/uiComponentsConfigs/editableTableConfig.js)** - Inline and popup editing configs

### 🎨 **Live Examples**
- **[Storybook](https://unified-dev.digit.org/storybook/)** - Interactive component playground
- **[Official DIGIT Documentation](https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui/ui-components-standardisation/digit-ui-components0.2.0)** - Integration guides

### 🔗 **Links**
- **[Source Repository](https://github.com/egovernments/DIGIT-UI-LIBRARIES/tree/develop)** - Main development repository
- **[NPM Package](https://www.npmjs.com/package/@egovernments/digit-ui-components)** - Published package

## 🤝 Contributors

Special thanks to our contributors:
- [@swathi-egov](https://github.com/swathi-egov)
- [@nabeelmd-egov](https://github.com/nabeelmd-egov) 
- [@bhavya-eGov](https://github.com/bhavya-eGov)
- [@nipunarora-eGov](https://github.com/nipunarora-eGov)
- [@tulika-egov](https://github.com/tulika-egov)
- [@jagankumar-egov](https://github.com/jagankumar-egov)
- [@Ramkrishna-egov](https://github.com/Ramkrishna-egov)
- [@piyushraj-egov](https://github.com/piyushraj-egov)

## 📄 License

MIT © [jagankumar-egov](https://github.com/jagankumar-egov)

## 🏛️ About DIGIT

This component library is part of the **DIGIT** (Digital Infrastructure for Governance, Impact & Transformation) platform - India's largest open-source platform for digital governance.

![DIGIT Logo](https://s3.ap-south-1.amazonaws.com/works-dev-asset/mseva-white-logo.png)

---

**🎯 Ready to build with DIGIT UI Components?** Start with our [Quick Start Guide](#-quick-start-examples) or explore the [Storybook](https://unified-dev.digit.org/storybook/) for interactive examples!
