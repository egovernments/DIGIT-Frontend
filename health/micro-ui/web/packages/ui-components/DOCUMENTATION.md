
##          Digit UI Components (React)

### Overview



This document details the essential modifications needed in the modules for smooth integration of components from the "ui-components" package.


In the ui-components package, several enhancements have been implemented to improve code clarity and address issues related to pixel inconsistencies,responsiveness,duplicate components in the library,difference between figma and the developed UI, writing custom code over existing code, localization issues etc. 

Previously, there were challenges associated with pixel-based sizing, leading to inconsistencies across different devices and screen resolutions. To mitigate this, the codebase has been updated to utilize rems as the primary unit of measurement. This transition to rems offers several advantages over pixels, including improved scalability and responsiveness across various viewport sizes.


Adopting rems ensures the components' styling is more consistent and adaptable, providing a seamless user experience across different platforms and devices.


Furthermore, Most of the components offer different variants. Adding variants for these components makes them more flexible, serving a wider range of purposes and meeting different design needs effectively.


$# digit-ui-components

## Install

```bash
npm install --save @egovernments/digit-ui-components
```


## Reference 

Storybook (https://unified-dev.digit.org/storybook/)


## Components List


Groups
Components
Foundations
Animations
Typography
Iconography
Colors
Spacers
Atoms
Accordion
ActionButton
AlertCard
Backlink 
BreadCrumb
Button
CheckBox
Chip
Divider
Dropdown
ErrorMessage
FileUpload
InfoButton
LabelFieldPair
Loader
Menu
MultiSelectDropdown
OTPInput
Panels
RadioButtons
SelectionTag
Stepper
StringManipulator
SummaryCardFieldPair
Switch
Tab
Tag
TextArea
TextBlock
TextInput
Timeline
Toast
Toggle
Tooltip
Molecules
AccordionList
BottomSheet
ButtonGroup
Card
FilterCard
FormCard
Footer
Hamburger
LandingPageCard
MenuCard
MetricCard
PanelCard
PopUp
ResultsDataTable
SideNav
SidePanel
SummaryCard
TableMolecule
TimelineMolecule
TooltipWrapper
Molecule Groups
LandingPageWrapper
MenuCardWrapper
Organisms
FormComposerV2
InboxSearchComposer



## Components : Variants & Features


Components
Variants
States & Features
Animations
Success
Error
Warning
Warning2
LoaderPrimary
LoaderPrimary2
LoaderWhite


Typography
Body
Button
Caption
Heading

Label
Link
Body L, Body S, Body XS
Button L, Button M, Button S
Caption L, Caption M, Caption S
Heading XL, Heading L, Heading M,Heading S,Heading XS
Label
Link L, LInk S, Link XS
Colors
Primary


Text


Alert









Generic




Paper
digitv2.lightTheme.primary-1 (#C84C0E)
digitv2.lightTheme.primary-2 ( #0B4B66)
digitv2.lightTheme.primary-bg (#FBEEE8)

digitv2.lightTheme.text-primary (#363636)
digitv2.lightTheme.text-secondary (#787878)
digitv2.lightTheme.text-disabled (#C5C5C5)

digitv2.lightTheme.alert-error (#B91900)
digitv2.lightTheme.alert-errorbg (#FFF5F4)
digitv2.lightTheme.alert-success (#00703C)
digitv2.lightTheme.alert-successbg (#F1FFF8)
digitv2.lightTheme.alert-info (#0057BD)
digitv2.lightTheme.alert-infobg (#DEEFFF)
digitv2.lightTheme.alert-warning (#9E5F00)
digitv2.lightTheme.alert-warning-bg (#FFF9F0)

digitv2.lightTheme.generic-background (#EEEEEE)
digitv2.lightTheme.generic-divider (#D6D5D4)
digitv2.lightTheme.generic-inputborder (#505A5F)

digitv2.lightTheme.paper-primary (#FFFFFF)
digitv2.lightTheme.paper-secondary (#FAFAFA)
Spacers
Spacer1
Spacer2
Spacer3
Spacer4
Spacer5
Spacer6
Spacer7
Spacer8
Spacer9
Spacer10
Spacer11
Spacer12
digitv2.spacers.spacer1
digitv2.spacers.spacer2
digitv2.spacers.spacer3
digitv2.spacers.spacer4
digitv2.spacers.spacer5
digitv2.spacers.spacer6
digitv2.spacers.spacer7
digitv2.spacers.spacer8
digitv2.spacers.spacer9
digitv2.spacers.spacer10
digitv2.spacers.spacer11
digitv2.spacers.spacer12
Accordion
Basic
Nested Accordion
Basic
With Stroke
With Divider
With Stroke and Divider
With Icon
With Number
AlertCard
Info
Success
Warning
Error
With Actions
Widgets Alignment
Action Button
Primary
Secondary
Teritiary
Link
State : Default / Disabled
ActionButton : Dropdown / Dropup
searchable : True / False
BackLink
BackLink1
BackLink2
BackLInk3
Basic
Disabled
BreadCrumb
Basic
Collapsed
With Icons
With Custom Seperators
Button
Primary
Secondary
Teritiay
Link
State - Default / Disabled
Size - Large, Medium, Small
With Icon
Icon Position - Prefix / Suffix
CheckBox
Unchecked
Intermediate
Checked
Label Alignment - Left / Right
State - Default / Disabled
Chip
Basic
Error
With Icon
With Close
Divider
Small
Medium
Large


Dropdown
Basic
Categorical
Nested Text
Profile
Profile with Nested Text
Tree Dropdown
State - Deafult / Disabled
Searchable - True / False
Panels
Success
Error


FileUpload
Uploader Field
Uploader Widget
Image Upload
SIngle / Multiple Upload
WIth Tag / WIth Preview
Loader
Basic
Page Loader
Overlay Loader


Multiselect Dropdown
Basic
Categorical
Nested Text
Tree Multiselect
State - Default / Disabled
Searchable - True / False
With Chips
WIth Select All
WIth Category Select All
OTPInput
6 Characters
4 Characters
With Masking 
Label Alignement - Above / Inline
RadioButtons
Basic
State - Default / Disabled / Non Editable
Label ALignment - Left / Right
Selection Tag
Single Select
Multi Select
With Container


Stepper
Horizontal
Vertical
Vertical -  With Divider
Switch
Basic
With Symbol
State - Default / Disabled
Label Alignment - Left / Right
Tag
Basic
Success
Error
Warning
With Stroke
With Icon
With OnClick
Tab
Basic


TextBlock
Basic


TextInput
Simple Text
Text With Prefix
Text WIth Suffix
Password
Numeric Counter
Date
Time
Location
Search
Default
Filled
Disabled
Non Editable
Focus
Error
Label
Character Count
Inner Label
Info
Help Text
Timeline
Inprogress
Upcoming
Completed
State - Default / Failed
With Connector
Elements Alignment - vertical / inline
Toast
Success
Error
Warning
Info
With transition time
Toggle
Basic


Tooltip
Dark Theme
LIght Theme
With Arrow
Position - BottomStart / Bottom / BottomEnd / TopStart / Top / TopEnd / LeftStart / Left / LeftEnd / RightStart / Right / RightEnd
TextArea


Default
Filled
Disabled
NonEditable
Focus
Error
Label
Character Count
Inner Label
Info
Help Text resizeSmart


AccordionList
Basic
With Divider
WIth Multiple Open
PopUp
Basic
Alert


Card
Basic
Form Card
Summary Card
Card Style - Primary / Secondary
FormCard


Columns - 1 / 2
Divider - True / False
SummaryCard


Layout - Horizontal / Vertical 
Columns - 1 / 2
Divider - True / False
BottomSheet
Basic
WIth Actions


ButtonGroup
Basic
Auto Sort - True/ False
Size - Large / Medium / Small
Equal Buttons - True / False
Header
Dark 
Light


SidePanel
Static




Dynamic
With  Close 
As Sections
Background Active
Position - Left / Right 

With Nudge
Draggable
PanelCard
Success
Error


FilterCard
Horizontal 
Vertical
With Heading
With Close
As Popup
Footer
Basic
Flex
Alignment - Left / Right
Hamburger
Dark 
LIght
Enable Search
Universal Actions
Profile
LandingPageCard
Basic
Icon - Default / Filled
Metric Alignment - Left / Centre
Icon Alignment - Left / Right
MenuCard
Menu1


MetricCard
Horizontal
Vertical
Mixed
Dividers - Vertical / Horizontal / Both
SideNav
Dark
Light
Enable Search
Universal Actions
Selection Color - Complementary / Analogous
TableMolecule
Basic


TimelineMolecule
Basic
Collapsable


TooltipWrapper
Basic


LandingPageWrapper
Basic


MenuCardWrapper
Basic






 Install

To install : Add the dependency in your package.json : 


```json
"@egovernments/digit-ui-components":"0.2.0"
```


Apply 

Syntax for importing any components : 


```javascript
import {TextInput, Dropdown} from "@egovernenets/digit-ui-components"
```



References & Resources For Migration 

Refer to the Sample Module Screens integrated with new ui-components library : 
Sample Module

Version Updates 

Refer to the ChangeLog for version updates



Storybook 

Refer to the Storybook for other information about components

Other Core Dependencies Versions

We have integrated this new component library with our core module module, so use the below version for latest core module with upgraded components

"@egovernments/digit-ui-react-components" : "1.8.19"
"@egovernments/digit-ui-libraries": "1.8.11"
"@egovernments/digit-ui-module-core": "1.8.32"




CSS Versions

```html
<link rel="stylesheet" href="https://unpkg.com/@egovernments/digit-ui-css@1.8.23/dist/index.css" />
<link rel="stylesheet" href="https://unpkg.com/@egovernments/digit-ui-components-css@0.2.0/dist/index.css" />
```


ATOMS
1.1 Accordion
Overview

The Accordion component provides a collapsible section that can be toggled open or closed, revealing or hiding content. This is useful for organizing content in a compact way, allowing users to expand or collapse sections as needed. The AccordionList is used to wrap multiple Accordion components and manage their open/close behavior.
Key Features
You can customize the appearance of the accordion with different icons, borders, and background styles.
It supports both single and multiple open accordions at once, depending on how you configure it.
The Accordion can show a title, optional number, and can be customized with additional content that appears when the section is opened.
The state of each accordion (open or closed) is controlled through props or by user interaction.

Do: When to Use This Component
When you want to organize large amounts of content into collapsible sections.
To hide less important content initially and only show it when the user wants.
When you need a clean, expandable interface for FAQs, settings panels, or detailed information.

Do Not: When Not to Use This Component
Avoid using accordions for content that needs to be permanently visible.
Don’t use it when the expanded content is essential and shouldn’t require user interaction to access.
Props for Accordion 
Property
Description
title
The title text that appears at the top of the accordion. Required
children
The content to display inside the accordion when it's open. Required.
icon
The icon to display beside the title (optional).
iconFill
The color of the icon. Defaults to a primary text color.
iconWidth
The width of the icon
iconHeight
The height of the icon 
isOpenInitially
Whether the accordion is open by default. Default to false
hideCardBorder
Hides the border around the accordion section.Default to false
hideDivider
Hides the divider line between the title and the content. Default to false
hideCardBg
Hides the background color of the accordion card. Default to false
hideBorderRadius
Hides the border radius on the accordion card. Default to false
number
A number to display before the title (optional).
onToggle
A callback function that gets called when the accordion is opened or closed.
customClassName
Custom CSS Class name for additional styling
customStyles
Custom inline styles for additional styling
isClosed
A boolean prop to control the state of the accordion. If true, the accordion will be closed externally. 
isChild
A boolean prop to check if the accordion is a child accordion in nested accordion.


Props for AccordionList
Property
Description
children
The Accordion components that are wrapped inside the wrapper. Required
allowMultipleOpen
Whether multiple accordions can be opened at the same time. Defaults to true
addDivider
Adds a divider between each accordion when there are multiple accordions. Defaults to true
className
Custom CSS class names for styling the wrapper. Optional.
styles
Custom inline styles for additional styling. Optional.



How to Use the Accordion Component
Basic Usage: You can use the Accordion component by providing a title and content. The content will be hidden or revealed when the user clicks on the title.
```jsx
<Accordion
  icon="AccountCircle"
  number={2}
  onToggle={() => {}}
  title="Accordion with Icon and Number"
>
  This accordion has both an icon and a number.
</Accordion>
```


Multiple Accordions with Wrapper: Use the AccordionList to manage multiple accordions. You can choose whether multiple sections can be open at the same time.

```jsx
<AccordionList
  className=""
  style={{}}
>
  <Accordion
    number={1}
    title="Accordion 1"
  >
    Lorem Ipsum is simply dummy text of the printing and typesetting industry
  </Accordion>
  <Accordion
    number={2}
    title="Accordion 2"
  >
    Lorem Ipsum is simply dummy text of the printing and typesetting industry
  </Accordion>
  <Accordion
    number={3}
    title="Accordion 3"
  >
    Lorem Ipsum is simply dummy text of the printing and typesetting industry
  </Accordion>
  <Accordion
    number={4}
    title="Accordion 4"
  >
    Lorem Ipsum is simply dummy text of the printing and typesetting industry
  </Accordion>
</AccordionList>
```



Customizing the Accordion: You can pass icons, styles, and more to customize the appearance and behavior.
```jsx
<Accordion
  customClassName="custom-accordion"
  customStyles={{
    backgroundColor: '#FFFFFF',
    borderColor: '#C84C0E'
  }}
  onToggle={() => {}}
  title="Custom Styled Accordion"
>
  This accordion has custom styles.
</Accordion>
```


For more Information Visit : Accordion


                                                         Figure 1.1.1 : Accordion    





                                                               Figure 1.1.2 : AccordionList

1.2 AlertCard

Overview
The AlertCard component is a versatile card-like UI element that displays a label, text, and optional additional content. It comes with built-in support for different variants like "info", "warning", "success", and "error", each with its corresponding icon. The component is useful for displaying messages, alerts, or important information in a structured and styled format. You can also add custom elements and arrange them either in a column or inline.
Key Features
Predefined Variants: Supports "info", "warning", "success", and "error" with relevant icons and default labels.
Customizable: Allows for custom labels, text, styles, and additional elements.
Flexible Layout: Supports both inline and column layouts for additional elements.
Automatic Formatting: Capitalizes and formats text labels and descriptions using built-in string manipulation.
Do: When to Use This Component
When you need to display alerts or status messages like success, error, or warnings.
When you need a card-like layout to showcase text and additional elements (e.g., links, buttons, icons).
When you want to provide a clear, formatted message with a built-in icon for various statuses.
Do Not: When Not to Use This Component
When you need a very simple message display without the need for icons, variants, or additional content.
When you require a highly complex or interactive card component (e.g., forms, inputs, dynamic content).
Props for AlertCard
Property
Description
label
The label or title for the AlertCard, displayed in the header.
text
The name of the icon to render inside the button.
variant
The type of AlertCard (info, warning, success, error), affecting icon.
style
Inline styles for the overall card container.
textStyle
Inline styles for the text portion of the card.
additionalElements
An array of additional components or elements to be displayed in the card..
inline
Boolean to display additional elements in a row (inline) or column layout.
className
Custom class for styling the outer wrapper of the AlertCard.
headerWrapperClassName
Custom class for the wrapper around the icon and label in the header.
headerClassName
Custom class for styling the label or header text.

How to Use the AlertCard Component

```jsx
<AlertCard
  additionalElements={[
    <p key="1">Additional Element 1</p>,
    <img key="2" alt="Additional Element 2" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIGMLufj86aep95KwMzr3U0QShg7oxdAG8gBPJ9ALIFQ&s"/>,
    <img key="3" alt="Additional Element 3" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIGMLufj86aep95KwMzr3U0QShg7oxdAG8gBPJ9ALIFQ&s"/>,
    <img key="4" alt="Additional Element 4" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIGMLufj86aep95KwMzr3U0QShg7oxdAG8gBPJ9ALIFQ&s"/>,
    <img key="5" alt="Additional Element 5" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIGMLufj86aep95KwMzr3U0QShg7oxdAG8gBPJ9ALIFQ&s"/>,
    <img key="6" alt="Additional Element 6" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIGMLufj86aep95KwMzr3U0QShg7oxdAG8gBPJ9ALIFQ&s"/>,
    <img key="7" alt="Additional Element 7" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIGMLufj86aep95KwMzr3U0QShg7oxdAG8gBPJ9ALIFQ&s"/>,
    <img key="8" alt="Additional Element 8" src="https://digit.org/wp-content/uploads/2023/06/Digit-Logo-1.png"/>,
    <TextArea populators={{resizeSmart: true}} type="textarea"/>,
    <InfoButton label="Button" size="large"/>
  ]}
  label="Info"
  text="Application process will take a minute to complete. It might cost around Rs.500/- to Rs.1000/- to clean your septic tank and you can expect theservice to get completed in 24 hrs from the time of payment."
  variant="default"
/>
```


		             Figure 1.2.1 : AlertCard With default variant
                                    Figure 1.2.2 : AlertCard With success variant
                                    Figure 1.2.3 : Alert With warning variant
                                       Figure 1.2.4 : AlertCard With error variant
 

For more Information Visit : AlertCard



1.3 BackLink

Overview
The BackLink component provides a simple, customizable button with an optional icon and label, commonly used for navigation purposes, such as going back to a previous screen or section. The icon and label can be hidden or customized based on the screen size or user preferences, and the component adapts to mobile view by resizing the icon.
Key Features
Customizable appearance: Choose from different icon styles and sizes.
Mobile responsiveness: Automatically adjusts icon size based on screen width.
Icon and label can be hidden if desired.
Disabled state support, preventing clicks and changing the appearance.
Multi-language support through the useTranslation hook for text like "Back."
Do: When to Use This Component
When you need a clear and simple "back" or "navigate away" button on your page.
On pages where users need to go back to the previous section or screen.
In mobile applications where an adaptive, responsive design is required.
Do Not: When Not to Use This Component
Avoid using it for primary navigation or for actions unrelated to "going back."
Don't use this for complex actions that require more detailed interaction.

Props for BackLink

Property
Description
className
Custom CSS class for additional styling of the component. Optional.
style
Inline styles for customizing the component’s appearance. Optional.
variant
The style of the icon (primary, secondary, teritiary). Dictates the icon type.
onClick
The function to call when the BackLink is clicked.
hideIcon
Hides the icon if set to true. Optional. Default value is false
hideLabel
Hides the label if set to true. Optional. Default value is false
disabled
Disables the link, preventing any click action and changing its appearance. Default value is false
iconFill
Custom color to fill the icon.
label
Custom label text for the BackLink. Defaults to a translation of "Back."



How to Use the BackLink Component
Basic Usage: To use the BackLink component, simply import it and pass the required props, such as the click event handler and optional customization.
```jsx
<BackLink
  className=""
  iconFill=""
  label="Back"
  onClick={() => {}}
  style={{}}
  variant="primary"
/>
```



Customizing the Icon and Label: You can change the icon variant, hide the label, or use a custom label.

```jsx
<BackLink variant="secondary" hideLabel={false} label="BackLink" onClick={() => history.goBack()} />
```


Mobile Responsiveness: The component automatically adjusts the icon size based on the screen width, so you don't need to manually handle mobile view changes.

Disabled State: Disabled can be set to true 


```jsx
<BackLink
  disabled=true
  label="Back"
  variant="primary"
/>
```


By adjusting the props, you can fully customize the behavior and appearance of the BackLink to fit your navigation and UI requirements.





        

           Figure 1.3.1 : PrimaryVariant                                                      Figure 1.3.2 : Secondary Variant


           
           

  


          
   Figure 1.3.3 : Teritiary Variant                                                                  Figure 1.3.4 : Disabled State  



For more Information Visit : BackLink


1.4 BreadCrumb

Overview
The BreadCrumb component is a navigation aid that allows users to keep track of their location within the hierarchy of the website. It displays a series of links that show the path from the homepage to the current page. If there are too many breadcrumbs to display, the component can collapse part of the trail to avoid taking up too much space. Users can expand the collapsed items by clicking a special "expand" crumb.
Key Features
Collapsing Crumbs: Automatically collapses breadcrumbs when the number of items exceeds a specified limit.
Expandable: Users can click the collapsed section (e.g., "...") to expand and see the full breadcrumb trail.
Customizable: Allows custom separators between breadcrumbs (default is "/") and custom icons for each crumb.
Back Navigation: Optionally allows the first crumb to be a "Back" button that triggers the browser's back function.
Flexible Configuration: You can customize how many crumbs are shown before and after the collapsed section, or change the text that appears when crumbs are collapsed (e.g., "…").
Do: When to Use This Component
Use this component when you want to give users a clear idea of where they are within the site’s hierarchy.
Use breadcrumbs for complex websites with many layers, allowing users to navigate back to previous levels quickly.
It’s great for mobile and desktop apps that involve nested navigation.
Do Not: When Not to Use This Component
Don’t use breadcrumbs as the primary navigation method; they are best as a secondary navigation tool.
Avoid using this component if your site has a very shallow structure (e.g., one or two levels).

Props for BreadCrumb

Property
Description
crumbs
An array of breadcrumb items, each containing the content, path, and optional icon.
className
Custom CSS class for additional styling of the breadcrumb component.
style
Inline styles to customize the breadcrumb container appearance.
spanStyle
Custom styles for the crumb text span.
customSeperator
Custom separator element between crumbs (default is "/").
maxItems
Maximum number of items to display before collapsing part of the trail.
itemsBeforeCollapse
Number of items to show before the collapsed section (when maxItems is exceeded).
itemsAfterCollapse
Number of items to show after the collapsed section.
expandText
Text to show in the collapsed crumb (default is "...").
itemStyle
Custom styles for the class “digit-bread-crumb-item” class



How to Use the BreadCrumb Component
Basic Usage: You can use the BreadCrumb component by passing an array of crumbs and their paths. For example:
```jsx
 <BreadCrumb
    crumbs={[
      {
        content: 'Home',
        show: true,
        icon: <SVG.Home fill={"#C84C0E"} />,
      },
      {
        content: 'Previous',
        show: true,
        icon: <SVG.Person fill={"#C84C0E"} />,
      },
      {
        content: 'Current',
        show: true,
        icon: <SVG.Edit fill={"#787878"} />,
      }
    ]}
   />
```




With Collapsing: If you want to limit the number of crumbs shown, use the maxItems, itemsBeforeCollapse, and itemsAfterCollapse props:


```jsx
  <BreadCrumb
    crumbs={[
      {
        content: 'Home',
        show: true
      },
      {
        content: 'Previous1',
        show: true
      },
      {
        content: 'Previous2',
        show: true
      },
      {
        content: 'Previous3',
        show: true
      },
      {
        content: 'Current',
        show: true
      }
    ]}
    expandText="{click here to expand}"
    maxItems={3}
  />
```



Custom Separators and Back Navigation: You can add a custom separator or use a "Back" crumb that navigates the user backward:

```jsx
  <BreadCrumb
    crumbs={[
      {
        content: 'Home',
        show: true
      },
      {
        content: 'Previous',
        show: true
      },
      {
        content: 'Current',
        show: true
      }
    ]}
 customSeperator: <SVG.ArrowForward fill={"#C84C0E"} />,
  />
```








                                               Figure 1.4.1 : BreadCrumb with icons

                                       Figure 1.4.2 : BreadCrumb with expandText

                                       Figure 1.4.3 : BreadCrumb with custom separator


For more Information Visit : BreadCrumb




1.5 Button

Overview
The Button component is a versatile and customizable button that can be used across your web application. It supports different variations like action buttons with dropdown menus, primary and link styles, and different sizes. You can attach icons, change text, and handle various click actions. This button can also toggle dropdown menus when set to be an action button.
Key Features
Customizable Icons: You can pass icons to the button, and they can be displayed before or after the text.
Dropdown Support: The button supports a dropdown menu when used as an action button, making it useful for more complex actions.
Dynamic Text: Automatically capitalizes the first letter and truncates long labels.
Multiple Styles: Offers variations like "primary,"”secondary”,”teritiary”, "link," and other custom styles based on the design system.
Sizes: Can be rendered in different sizes: large, medium, and small.
Disabled State: Supports disabled state styling and behavior.
Do: When to Use This Component
Use this button when you need a clickable element that performs an action or navigates somewhere.
Use this button with dropdown capabilities for complex actions that offer multiple options.
Ideal for form submissions, navigation, and actions with confirmation steps.
Do Not: When Not to Use This Component
Don’t use this component if you only need a static element that doesn’t perform any action (consider using a label or text instead).
Avoid using it as a pure display element, as it's designed to be interactive.
Don’t use the dropdown feature if there’s only one action available; a simple button would suffice.

Props for Button 
Property
Description
label
The text content inside the button (required).
variation
The button's style variation, such as "primary",”secondary”,”teritiary,” "link".
icon
A string representing the icon name to render inside the button.
onClick
Function to handle the button's click event (required).
isDisabled
A boolean that disables the button and applies disabled styling.
className
A custom class name to apply additional styling to the button.
style
An object containing custom inline styles for the button.
textStyles
Styles applied to the button's label (usually h2).
isSuffix
A boolean that determines if the icon is rendered after the text.
size
The size of the button can be "large," "medium," or "small."
iconFill
The color fill for the icon.
type
The type of button (e.g., "submit," "button," or "actionButton").
submit
A boolean that determines if this is a submit button for forms.
options
An array of options for the dropdown menu (used with action buttons).
ref
A ref passed to the button element, often used for DOM manipulation.
isSearchable
A boolean indicating whether the dropdown is searchable. 
onOptionSelect
Function to handle selection from the dropdown menu.
menuStyles
Custom styles for the dropdown menu.
showBottom
A boolean that determines the placement of the dropdown icon.
title
Title will be shown on hover over Button
hideDefaultActionIcon
Hides default action button icon. Default value is false
optionsKey
Options key for menu options

How to Use the Button Component
Basic Usage: Use this component for a simple button by passing the required label and an onClick function.
```jsx
  <Button
    className=""
    icon="MyLocation"
    iconFill=""
    label="Button"
    onClick={(e) => {console.log(e}}
    size=""
    style={{}}
    title=""
    variation="primary"
  />
```

Action Button with Dropdown: For more advanced use cases, the button can toggle a dropdown menu for additional options.
```jsx
  <Button
    className=""
    iconFill=""
    isSearchable=true
    label="ActionButton"
    onClick={() => {}}
    variation="primary"
    onOptionSelect={(option) => console.log(option)} 
    options={[
      {
        code: 'Actiona',
        name: 'Action A'
      },
      {
        code: 'Actionb',
        name: 'Action B'
      },
      {
        code: 'Actionc',
        name: 'Action C'
      }
    ]}
    optionsKey="name"
    showBottom=true
    size=""
    style={{}}
    title=""<
    type="actionButton"
  />
```

Disabled Button: You can disable the button using the isDisabled prop.
```jsx
  <Button
    variation="primary"
    className=""
    iconFill=""
    isDisabled=true
    label="Button"
    onClick={() => {}}
    options={[]}
    optionsKey=""
    size=""
    style={{}}
    title=""
  />
```


Figure 1.5.1 : Primary Variation of Button with icon 







Figure 1.5.2 : Primary Variation of Button Disabled




Figure 1.5.3 : Secondary Variation of Button with suffix icon





Figure 1.5.4 : Secondary Variation of Button Disabled






Figure 1.5.5 : Teritiary Variation of Button with icon





Figure 1.5.6 : Teritiary Variation of Button Disabled






Figure 1.5.7 : Link Variation of Button





Figure 1.5.8 : Link Variation of Button Disabled









Figure 1.5.9 : Searchable Action Button With Menu on Bottom








Figure 1.5.10 : UnSearchable Action Button With Menu on Top






For more Information Visit : Button

1.6 CheckBox

Overview 
The CheckBox component provides a versatile and customizable checkbox that can be used in different forms or settings. It supports various configurations like placing the label before or after the checkbox, displaying intermediate states, and hiding or customizing the label. This component is useful for forms, selections, or scenarios where a checkbox is needed to capture user inputs. It is mobile-friendly and adaptable for different user types.
Key Features
Custom Label Placement: The label can appear before or after the checkbox based on the isLabelFirst prop.
Customizable Label Content: Allows custom HTML or JSX content for the label using customLabelMarkup.
Intermediate State: Supports an intermediate state to show partial selections, useful for scenarios like selecting a parent category that partially applies to sub-items.
Disabling and Hiding Labels: The checkbox can be disabled and the label can be hidden if needed.
Do: When to Use This Component
When you need a customizable checkbox in forms or lists.
When you want to allow users to select or unselect options, or when an intermediate selection is required.
When you need to add a checkbox with custom label positioning or custom label content.
Do Not: When Not to Use This Component
When you need radio buttons (i.e., for selecting only one option from a group).
When no interaction is required, or when the checkbox is purely for visual purposes without functionality.
When a switch would be a better fit (i.e., for simple on/off or true/false selections).
Props for Checkbox 
Property
Description
label
The text displayed as the checkbox label (required).
onChange
Function to call when the checkbox value changes.
value
The value of the checkbox (typically used in forms).
disabled
Disables the checkbox if set to true
ref
Reference to the checkbox input element.
checked
Boolean indicating whether the checkbox is checked.
inputRef
Ref for the input field of the checkbox.
pageType
Defines user type (e.g., 'employee', 'citizen'), determines styles for specific user types.
style
Custom styles to apply to the checkbox.
index
Index to identify the checkbox in lists or groups.
isLabelFirst
Controls whether the label appears before (true) or after (false) the checkbox.
customLabelMarkup
Custom HTML/JSX content for the label.
hideLabel
Hides the label if set to true
isIntermediate
Displays an intermediate checkbox state, useful for partial selections.
mainClassName
Custom class name for “digit-checkbox-container” class
labelClassName
Custom class name for label
onLabelClick
On Click function for label
inputWrapperClassName
Custom class name for input label wrapper
inputClassName
Custom class name for input tag
inputIconClassname
Custom class name for the class “digit-custom-checkbox”
iconFill
Icon color for check


How to Use the Checkbox Component

Basic Usage: Include the CheckBox component and provide a label and an onChange handler:
<CheckBox
      label={"Label"}
      checked={isChecked}
      onChange={handleCheckboxChange}
    ></CheckBox>



Advanced Usage: Customize the checkbox with additional props such as isLabelFirst, and isIntermediate:

<CheckBox
      label={"Label"}
      checked={isChecked}
      onChange={handleCheckboxChange}
      isLabelFirst={true}
    ></CheckBox>


Disabling the Checkbox: Disable the checkbox by setting the disabled prop

<CheckBox
      label={"Label"}
      checked={isChecked}
      onChange={handleCheckboxChange}
      isLabelFirst={true}
      disabled={true}
    ></CheckBox>





  Figure 1.6.1 : Checkbox With Label

                                  Figure 1.6.2 : Checkbox With Label

 

Figure 1.6.3 : Checkbox With Label First


                                 Figure 1.6.4 : Checkbox With Label First



Figure 1.6.5 : Checkbox Checked





Figure 1.6.6 : Checkbox With Intermediate State





Figure 1.6.7 : Checkbox Disabled




Figure 1.6.8 : Checkbox Checked Disabled


Figure 1.6.9 : Checkbox Intermediate Disabled




For more Information Visit : Checkbox

1.7 Chip

Overview
The Chip component in React is used to display a small, concise piece of information, often in a compact UI layout. It includes customizable features like a close button, error messaging, click events, and support for custom styles. This component is great for scenarios where you need to show labels or tags with the option to dismiss them, or display error messages alongside a tag.
Key Features
Customizable Text and Styles: You can pass custom styles for the tag, text, and close icon.
Error Handling: The component supports displaying error messages and clicking on errors to trigger actions.
Optional Close Button: You can hide the close button if not needed.
Clickable Tags: The chip can trigger functions when clicked.
Disable Functionality: You can disable the chip to prevent any interaction.
Do: When to Use This Component
When you need to show tags or labels in a compact format.
When you need a tag that supports error handling.
When you want tags to be interactive or dismissible.
Do Not: When Not to Use This Component
When you need large or complex UI elements.
If you need to display long text without truncation.
If you're building a static UI without interaction.
Props for Chip 
Property
Description
className
Custom class to apply additional styling to the chip.
text
The text or label to display inside the chip. This is required.
onTagClick
Function to execute when the tag is clicked.
onClick
Function to execute when the close button is clicked.
extraStyles
Object containing custom styles for the tag, text, and close icon.
disabled
Disables the chip interaction when true.
isErrorTag
Boolean to apply error-specific styles to the chip.
error
String for the error message to be displayed below the chip.
hideClose
Hides the close button when true.
onErrorClick
Function to execute when the error message is clicked.
iconReq
Custom icon inside chip



How to Use the Chip Component
Basic Usage: Include the Chip component and provide a text

<div className="digit-tag-container">
  <Chip
    className=""
    error=""
    extraStyles={{}}
    onClick={() => {}}
    onTagClick={()=>{}}
    text="Chips"
    iconReq = “Edit”
  />
</div>


Hide Close Icon:Send hideClose as true

<div className="digit-tag-container">
  <Chip
    className=""
    error=""
    extraStyles={{}}
    hideClose={true}
    onClick={() => {}}
    onTagClick={()=>{}}
    text="Chips"
  />
</div>


Error Tag:Send isErrorTag as true

<div className="digit-tag-container">
  <Chip
    className=""
    error=""
    extraStyles={{}}
    isErrorTag
    onClick={() => {}}
    onTagClick={()=>{}}
    text="ErrorChips"
  />
</div>


Error Tag With ErrorMessage: Send isErrorTag as true and error for the error message

<div className="digit-tag-container">
  <Chip
    className=""
    error="ErrorMessage"
    extraStyles={{}}
    isErrorTag
    onClick={() => {}}
    onTagClick={()=>{}}
    text="ErrorChipsWithError"
  />
</div>


Disabled Tag:Send disabled as true , does not perform any onClick logics. 

<div className="digit-tag-container">
  <Chip
    className=""
    disabled
    error=""
    extraStyles={{}}
    onClick={() => {}}
    onTagClick={()=>{}}
    text="DisabledChips"
  />
</div>









Figure 1.7.1 : Chip                                                                     Figure 1.7.2 : Chip WIth Hidden Close






  

Figure 1.7.3 : Chip As Error Tag                                        Figure 1.7.4 : Chip As Error Tag With Error  


                  
For more Information Visit : Chip                      


1.8 Divider

Overview
The Divider component is a simple horizontal line (<hr>) used to visually separate content in a user interface. It provides a clean and clear division between sections and can be styled with custom CSS classes and inline styles. The component is easy to customize, allowing you to adjust its appearance based on the design needs of your project.
Key Features
Customizable Styles: You can apply custom CSS classes and inline styles to modify the appearance of the divider.
Variants: The variant prop lets you add predefined styles or modify the divider's appearance based on different contexts.
Simple and Lightweight: It’s a lightweight and straightforward component that focuses solely on visual separation.
Do: When to Use This Component
When you need a simple visual separator between sections of content.
To create clear boundaries between related UI elements.
When designing forms, lists, or content areas where clarity is important.
Do Not: When Not to Use This Component
When you require complex visual dividers (e.g., with icons or text).
If the divider is purely decorative without any real need for separation.

Props for Divider 
Property
Description
className
Custom CSS class name for styling the divider.
style
Inline styles object to customize the divider’s appearance.
variant
Defines the type or style variant of the divider ("small",”medium”,”large”).


How to Use the Divider Component
  <Divider
    className=""
    style={{}}
    variant="small"
  />


                                         Figure 1.8.1 : Divider Small Variant 

                                        Figure 1.8.2 : Divider Medium Variant 
                                        Figure 1.8.3 : Divider Large Variant 


For more Information Visit : Divider

1.9 Dropdown

Overview
The Dropdown component is a flexible, dynamic, and highly customizable React component used to display a list of selectable options. The component is capable of handling both single selection, and it supports various configurations such as filtering, custom styling, hierarchical options, accessibility features, and more.
Key Features
Customizable Options: Pass static or dynamic options to the dropdown.
Searchable: Options can be filtered by user input.
Nested and Tree Structures: The dropdown supports hierarchical structures to represent nested or grouped options.
Responsive Design: Adjusts for different screen sizes automatically.
Accessibility: Accessible with keyboard navigation.
Custom Styling: Allow for complete styling customization via CSS or inline styles.
Custom Icons: Attach custom icons to each option.
Do: When to Use This Component
You need a list of options that users can select from.
You require both single and multiple selections.
You need to group related options (nested or tree structures).
You want a searchable dropdown to filter options.
The UI needs to be responsive across different devices.
Custom styling and branding are required.
You need to handle loading states and errors.
Do Not: When Not to Use This Component
You have a fixed set of options that don’t need to be dynamically loaded or updated.
The number of options is too small to warrant a dropdown (e.g., radio buttons might be a better choice).
You need complex, nested data (use other more suitable components like a tree view).
You require a more advanced solution like a multiselect component with complex filtering and tagging.
Props for Dropdown
Property
Description
option
An array of objects representing the options in the dropdown.
variant
Variant of the dropdown : nesteddropdown / treedropdown / profiledropdown / profilenestedtext
id
Id of the input
placeholder
Placeholder text to display when no option is selected.
onBlur
onBlur call back function for the input
optionKey
Unique key for the options present inside each object of option array
showIcon
Boolean flag to show the icons for each option. 
className
Custom className for the “digit-dropdown-employee-select-wrap” class
style
Custom style for the “digit-dropdown-employee-select-wrap” class
profilePic
Shows this profile pic in place of dropdown input
theme
Theme - dark / light
customSelector
Shows Custom selector in place of dropdown input
showArrow
Boolean flag to show dropdown arrow
isSearchable
Boolean flag to check whether dropdown should be searchable or not.
disabled
Boolean flag to disable the dropdown




keepNull
Boolean flag to show null in the input
t
Translation function
freeze
Freeze the input change
ref
Reference to the input
showTooltip
Boolean flag to show tooltip on hover
showBottom
Boolean flag to show menu at bottom
menuStyles
Custom styles for the menu
optionCardStyles
Custom styles for the options card 
selected
Default selected values (mandatory)




autoFocus
Boolean flag for autoFocus the input
select
Select function when any option selection changes (mandatory)


How to Use different Variants of Dropdown
Simple Dropdown
The simple dropdown displays a list of flat, ungrouped options. It's ideal for small sets of options.
Nested Dropdown
The nested dropdown allows you to organize options into groups or categories. This is useful for a large number of options or related groups of choices.
Tree Dropdown
The tree view dropdown is useful when you need to represent hierarchical relationships or nested data. It's similar to a nested dropdown, but the tree view can support deeper nesting levels.

 
               <Dropdown
                  style={}
                  variant={error ? "error" : ""}
                  t={t}
                  option={projectType?.["HCM-PROJECT-TYPES"]?.projectTypes}
                  optionKey={"code"}
                  selected={type}
                  select={(value) => {
                    handleChange(value);
                  }}
                  disabled = {false}
                />


              Figure 1.9.1 : Simple Dropdown


         Figure 1.9.2 : Categorical Dropdown
Figure 1.9.3 : NestedText Dropdown


    Figure 1.9.4 : Profile Dropdown

Figure 1.9.5 : Profile With NestedText Dropdown


                Figure 1.9.6 : Tree Dropdown

For more Information Visit : SingleSelectDropdown
1.10 ErrorMessage

Overview
The ErrorMessage component is a user interface element used to display error messages. It provides flexibility in terms of styling, supports truncating long messages, and includes the option to display an error icon alongside the message. This component helps communicate issues or errors clearly to users in a user-friendly manner.
Key Features
Customizable Display: You can apply custom styles and class names for both the error message and its wrapper.
Optional Error Icon: The component can optionally display an icon next to the error message, which helps visually indicate an issue.
Message Truncation: Long error messages can be truncated, with the option to define a maximum length for the displayed message.
Flexible Formatting: The error message text is automatically formatted in sentence case for improved readability.
Do: When to Use This Component
When you need to show clear, concise error messages to the user.
In forms, data input sections, or any part of the interface where error feedback is required.
When you want to visually indicate an error using an icon.
Do Not: When Not to Use This Component
When the message is not related to an error or alert (use a different component for informational messages).
If you want to display non-truncated text that exceeds typical message lengths (use custom handling for longer messages).
Props for ErrorMessage 
Property
Description
className
Custom CSS class name for styling the divider.
style
Inline styles object to customize the divider’s appearance.
message
Defines the type or style variant of the divider ("small",”medium”,”large”).
showIcon
If true, displays an error icon next to the message.
iconStyles
Inline styles for the error icon.
truncateMessage
If true, truncates the message to a specified maximum length.
maxLength
The maximum length of the message when truncateMessage is set to true.
wrapperClassName
CSS class for the wrapper element that contains the error message and icon.
wrapperStyles
Inline styles for the wrapper element.


How to Use the ErrorMessage Component
<ErrorMessage
  className=""
  iconStyles={{}}
  maxLength=""
  message="Error Message With Icon"
  showIcon
  style={{}}
  wrapperClassName=""
  wrapperStyles={{}}
/>


                                                         Figure 1.10.1 : ErrorMessage With Icon

For more Information Visit : ErrorMessage

1.11 FileUpload

Overview
The FileUpload component is a flexible file uploader that supports multiple file formats, previews, tagging, and validation. It provides an easy way to upload, remove, and manage files with error handling and preview options.
Key Features
Supports multiple file formats – Accepts images, PDFs, Excel, Word documents, and more.
File validation – Checks file size, type, and other constraints.
Multiple upload options – Includes upload widget, upload field, and upload image variants.
Preview support – Displays image and document previews.
Error handling – Shows validation messages and prevents invalid file uploads.
Re-upload and download support – Allows users to re-upload or download files.
Custom styling and inline display support.
Do: When to Use This Component
When users need to upload files, images, or documents.
When validation is required on file size or type.
When needing file previews before submission.
When allowing multiple files to be uploaded at once.
Do Not: When Not to Use This Component
When files are required to be directly stored on a database instead of being processed first.
When needing real-time upload progress tracking (progress bar not included).
Props for FileUpload 
Property
Description
variant
Variant of the FileUpload : “uploadWidget” , “uploadImage”, “uploadField”
multiple
Allows multiple file uploads
onUpload
Callback triggered when files are uploaded.
validations
validations object which allows two properties : maxSizeAllowedInMB and minSizeAllowedInMB
removeTargetedFile
Callback when a specific file is removed.
showHint
Boolean flag to display hint text
showLabel
Boolean flag to display the label above the uploader.
accept
Specifies accepted file types (e.g., "image/png, .jpg, .jpeg").
additionalElements
Additional elements to be shown in uploadWidget
showErrorCard
Boolean flag to show Error Card in uploadWidget
iserror
Error message when a file is invalid.
showDownloadButton
Enables Download button for the variant “uploadWidget”
showReUploadButton
Enables Re-Upload button for the variant “uploadWidget”
customClass
Custom class name for the class “digit-upload”
disabled
Disables the upload input.
style
Custom styles object for the class “digit-upload”
id
Custom ID for the file input.
extraStyles
buttonStyles
disabledButton
Disables the upload button.
textStyles
Button text styles for the upload button
buttonType
Type of the Upload Button
showAsTags
Displays uploaded file names as chips.
showAsPreview
Enables preview display for uploaded files.
inline
Wraps label and upload field inline
T
Label for the Upload Field


How to Use the FileUpload Component

<FileUpload
  multiple
  onUpload={(uploadedFiles)=>{return uploadFiles;}}
  showAsTags
  uploadedFiles={[]}
  variant="uploadField"
  validations= {maxSizeAllowedInMB:5,minSizeAllowedInMB:1}
/>


<FileUpload
  multiple
  showDownloadButton
  showReUploadButton
  uploadedFiles={[]}
  validations={{
    maxSizeAllowedInMB: 5,
    minSizeRequiredInMB: 1
  }}
  variant="uploadWidget"
/>


<FileUpload
  multiple
  uploadedFiles={[]}
  validations={{
    maxSizeAllowedInMB: 5,
    minSizeRequiredInMB: 1
  }}
  variant="uploadImage"
/>


Figure 1.11.1 : “uploadField” variant : showAsTags


                 Figure 1.11.2 : “uploadField” variant : showAsTags and Validations


                   Figure 1.11.2 : “uploadField” variant : showAsPreview and Validations

                                   Figure 1.11.3 : “uploadWidget” variant 
                                  Figure 1.11.4 : “uploadWidget” variant : with validations
For more Information Visit : FileUpload

1.12 InfoButton

Overview
The InfoButton component is a customizable button with support for icons, different sizes, and label truncation. It allows you to easily add buttons with icons either before or after the text. You can also apply styles and customize the button's behavior and appearance, making it versatile for use in forms, links, and general actions.
Key Features
Customizable Icons: Add icons before or after the label.
Button Sizes: Available in small, medium, and large sizes.
Truncated Labels: Automatically shortens long labels and capitalizes the first letter.
Custom Styles: Supports custom styling for both the button and label text.
Disabled State: Provides the ability to disable the button when necessary.
Do: When to Use This Component
When you need a button with an optional icon, used for general actions.
When you require a button with different sizes (small, medium, large).
If the button needs to have custom styles or align with a specific design system.
Do Not: When Not to Use This Component
If you don't need a button that supports icons or custom styling.
When you only require a basic HTML button without additional features.

Props for InfoButton 
Property
Description
label
The text label for the button (will be truncated if too long).
icon
The name of the icon to render inside the button.
onClick
The function to call when the button is clicked.
className
Custom class for styling the button.
style
Inline styles for the button component.
textStyles
Inline styles for the button label text.
isDisabled
Disables the button when true.
isSuffix
If true, the icon is rendered after the text label; otherwise, it's rendered before.
size
Defines the size of the button (small, medium, or large).
infobuttontype
Specifies the button type (info by default, but can be customized as success,error,warning).


How to Use the InfoButton Component
  <InfoButton
    className=""
    infobuttontype="success"
    label="Button"
    onClick={()=>{}}
    size=""
    style={{}}
  />





Figure 1.12.1 : InfoButton With “info” as type








Figure 1.12.2 : InfoButton With “success” as type







Figure 1.12.3 : InfoButton With “warning” as type







Figure 1.12.4 : InfoButton With “error” as type




For more Information Visit : InfoButton

1.13 LabelFieldPair
Overview
The LabelFieldPair component is a simple container that pairs labels with their corresponding input fields or other content. It helps structure form elements in a clean and organized way, allowing for either a horizontal (default) or vertical layout. This component is particularly useful when you want to create consistent and flexible layouts for labels and fields across your application.
Key Features
Custom Layout: Supports both horizontal and vertical layouts for labels and fields.
Flexible: Allows any child elements to be placed within it, making it useful for various form field types.
Customizable: Accepts custom class names and styles for flexibility in design.
Do: When to Use This Component
When you need to pair a label with a form field, such as an input, select box, or checkbox.
When you want to ensure consistent spacing and alignment between labels and fields across forms.
When you need to control whether the label and field should be displayed vertically or horizontally.
Do Not: When Not to Use This Component
When you need complex validation or interactivity between the label and field (this component is purely for layout).
When you don't require both a label and a field together—this is specifically designed for pairing elements.
Props for LabelFieldPair
Property
Description
className
Optional string to apply custom class names to the component.
style
Optional object to apply inline styles to the component.
children
Required prop that defines the elements (label, field) to be displayed.
vertical
Optional boolean to specify if the label-field pair should be displayed vertically.
removeMargin
Removes the default 1.5rem margin bottom.

How to Use the LabelFieldPair Component

 <LabelFieldPair>
    <TextBlock body={"Name"}></TextBlock>
    <TextInput type="text"></TextInput>
  </LabelFieldPair>



  <LabelFieldPair vertical={true}>
    <TextBlock body={"Name"}></TextBlock>
    <TextInput type="text"></TextInput>
  </LabelFieldPair>


			                    Figure 1.13.1 : LabelFieldPair
		               Figure 1.13.2 : LabelFieldPair With Vertical ALignment

For more Information Visit :LabelFieldPair

1.14 Loader
Overview

The Loader component is used to display an animated loading indicator. It supports different variants, customizable styles, and allows dynamic text and animations. This component helps in improving user experience by visually indicating ongoing processes like API calls, data fetching, or form submissions.
Key Features
Supports Different Variants – Allows different loader styles based on variant.
Custom Loader Text – You can display a text message while loading.
Customizable Animation – Supports Lottie animation customization through animationStyles.
Loop & Autoplay Control – Configure whether the animation loops or plays automatically.
Custom Styles – Apply custom styles via the style prop.
Do: When to Use This Component
Use this component when loading data from APIs.
Use it during form submissions to show progress.
Use it as a full-screen overlay loader while fetching large data.
Do Not: When Not to Use This Component
Do not use it for minor UI delays where a subtle indicator (like a skeleton loader) is better.
Do not overuse it on every small interaction, as it can make the UI sluggish.
Props for Loader
Property
Description
variant
Specifies the loader type (e.g., "OverlayLoader" for full-screen loading,”PageLoader”).
className
Custom class for additional styling.
style
Custom styles for the loader container.
loaderText
Text to display below the loader (e.g., "Loading" will show "Loading...").
animationStyles
Object to customize the Lottie animation (e.g., width, height, animationData).

width : Sets the width of the animation (default: "6.25rem").
height : Sets the height of the animation (default: "6.25rem").
noLoop : If true, animation does not loop (default: false).
noAutoplay : If true, animation does not autoplay (default: false).
animationData : Provides a custom animation JSON for the loader.

How to Use the Loader Component

<Loader variant={"PageLoader"}/>


<Loader variant={"OverlayLoader"}/>




                                                           
	                                    Figure 1.14.1 : Basic Loader  
			                         Figure 1.14.2 : PageLoader	



                                                   Figure 1.14.3 : Overlay Loader

For more Information Visit : Loader
1.15 Menu
Overview

The Menu component is a dropdown menu that allows users to select an option from a list. It supports search functionality, icons for options, and custom styling. This component is commonly used in navigation menus, settings dropdoTextwns, and user selection lists.
Key Features
Searchable Menu – Enables a search bar to filter options dynamically.
Customizable Options – Supports custom icons and styles for each option.
Keyboard & Mouse Support – Allows click & keyboard-based navigation.
Flexible Styling – Customize appearance via className and style props.
Easy Selection Handling – Calls a function when an option is selected.
Do: When to Use This Component
Use this component when you need a dropdown selection menu.
Use it when the list of options is large and needs filtering.
Use it when icons need to be shown alongside menu items.
Do Not: When Not to Use This Component
Do not use this component for static navigation bars 
Do not use it for single-click actions (Use <Button> instead).
Props for Menu
Property
Description
options
Array of options to display in the menu.
optionsKey
The key in each option object that holds the display text.
onSelect
Function triggered when an option is selected.
showBottom
If true, the menu appears at the bottom.
isSearchable
if true, enables a search bar to filter options.
style
Custom styles for the menu container.
className
Additional class names for styling.
setDropdownStatus
Sets the menu dropdown status, triggered when an option is selected
ref
Reference to the “header-dropdown-menu”

How to Use the Menu Component
<Menu
  options={[
    { name: "Dashboard", icon: "Home" },
    { name: "Analytics", icon: "Graph" },
    { name: "Reports", icon: "Document" }
  ]}
  optionsKey="name"
  isSearchable={true}
  onSelect={(option) => console.log("Selected:", option.name)} />

                                                        Figure 1.15.1 : Menu

1.16 MultiSelectDropdown

Overview
The MultiSelectDropdown component allows users to select multiple options from a dropdown list. It supports nested options, select-all functionality, searchability, and chips for selected items. The component is flexible and can be customized based on different use cases.
Key Features
Supports multiple selections
Can display options in nested categories
Select all and category select all options
Searchable dropdown for easy filtering
Displays selected options as chips
Keyboard navigation for accessibility
Supports pre-selected options and controlled state
Configurable UI with icons, labels, and additional styles
Do: When to Use This Component
Use when multiple selections are required
Use when options are grouped into categories
Use when search functionality is needed for filtering
Use when a clear and user-friendly selection UI is needed
Do Not: When Not to Use This Component
Avoid when only a single selection is needed (use a Dropdown component instead)
Avoid if the number of options is very small (use checkboxes instead)
Avoid if the dataset is too large without server-side filtering
Props for MultiSelectDropdown
Property
Description
options
List of options available for selection
optionsKey
Key in option object to display labels
selected
List of pre-selected options
onSelect
Callback function when an option is selected/deselected
onClose
Callback when the dropdown is closed
defaultLabel
Default placeholder text when no options are selected
defaultUnit
Unit label to be appended to selected count
props
className : Custom class name for “digit-multiselectdropdown-wrap” 
style : Custom style for “digit-multiselectdropdown-wrap” 
isPropsNeeded
Default value is false.
ServerStyle
Custom styles for the dropdown panel
config
Configuration for dropdown behavior (e.g., number of displayed chips, icons)

showIcon : Shows icons beside options when its enabled
isDropdownWithChip : Shows removable chips when enabled
numberOfChips: Maximum chips to be shown, adds +Chip if more options were selected
clearLabel : Custom label for clear all chip
disabled
Disables the dropdown.Default value is false.
variant
Type of dropdown (e.g., "nestedmultiselect", "treemultiselect","nestedtextmultiselect”)
addSelectAllCheck
Shows "Select All" option. Default value is false.
addCategorySelectAllCheck
Shows "Select All" for categories. Default value is false.
selectAllLabel
Custom label for "Select All"
categorySelectAllLabel
Custom label for category-level "Select All"
restrictSelection
Restricts selection if true.
isSearchable
Enables search functionality. Default value is false.
chipsKey
Key in selected options to display as chips
frozenData
List of options that should not be removable
handleViewMore
Function to handle the "View More" button in chip display

How to Use the MultiSelectDropdown Component

<MultiSelectDropdown
              onClose={(values) => {
                setSlectedOptions(values);
              }}
              defaultLabel="" // Default label for selected
              defaultUnit="" // Default unit for selected
              props={{
                className:'', // custom class name for digit-multiselectdropdown-wrap
                style:{} // custom styles for digit-multiselectdropdown-wrap
              }}
              isPropsNeeded={false}
              ServerStyle={{}} // custom styles for digit-multiselectdropdown-server
              config={{
                clearLabel: "", // label for clear all chip , default label is "Clear All"
                isDropdownWithChip: true, // flag to show chips
                showIcon: true, // flag to add icons for each options
                numberOfChips: 4, // count of the chips to be shown , if more selected adds + chip
              }}
              disabled={false} // disable multiselect dropdown
              selectAllLabel="" // label for select all
              categorySelectAllLabel="" // label for category level select all
              restrictSelection={false} // restricts to select any option
              isSearchable={true} // flag to make multiselect dropdown selectable
              chipsKey="" // what to be shown as label for chips
              frozenData={[
                {
                  code: "Category A.Option A",
                  name: "Option A",
                  icon: "Article",
                },
              ]}
              // can add frozen data
              handleViewMore={(e) => {
                setShowPopup(true);
              }} // when clicked on + chip this is called
              showTooltip={true} // flag to show the tooltip for labels and options on hover
              variant={"nestedmultiselect"} // varinat ("treemultiselect","nestedmultiselect","nestedtextmultiselect")
              onSelect={() => {}} // mandatory prop
              selected={[]} // selected array
              addSelectAllCheck={true} // flag to add select all check
              addCategorySelectAllCheck={true} // flag to add category select all check
              options={[
                {
                  name: "Category A",
                  options: [
                    {
                      code: "Category A.Option A",
                      name: "Option A",
                      icon: "Article",
                    },
                    {
                      code: "Category A.Option B",
                      name: "Option B",
                      icon: "Article",
                    },
                    {
                      code: "Category A.Option C",
                      name: "Option C",
                      icon: "Article",
                    },
                  ],
                  code: "Category A",
                },
                {
                  name: "Category B",
                  options: [
                    {
                      code: "Category B.Option 1",
                      name: "Option 1",
                      icon: "Article",
                    },
                    {
                      code: "Category B.Option 2",
                      name: "Option 2",
                      icon: "Article",
                    },
                    {
                      code: "Category B.Option 3",
                      name: "Option 3",
                      icon: "Article",
                    },
                  ],
                  code: "Category B",
                },
              ]} // options to be shown
              optionsKey={"code"} // key for the options
            ></MultiSelectDropdown>


                                                  Figure 1.16.1 : Simple MultiselectDropdown


                                                Figure 1.16.2 : Nested MultiselectDropdown
                                              Figure 1.16.3 : NestedText MultiselectDropdown


                                       Figure 1.16.4 : Tree MultiselectDropdown
                        Figure 1.16.5 : MultiselectDropdown with max chips allowed


1.17 OTPInput
Overview
The OTPInput component is a versatile and customizable input field designed to collect One-Time Password (OTP) entries. It allows users to input characters into individual boxes and supports both numeric and alphanumeric types. The component handles user input, including keyboard navigation (e.g., moving between input boxes) and validation. It also supports pasting data, handling backspace, and displaying error messages when validation fails.
Key Features
Customizable Length: Supports OTP of varying lengths, with a default length of 6 characters.
Input Type: Choose between numeric or alphanumeric OTP inputs.
Keyboard Navigation: Users can move between input boxes using arrow keys, Enter, or Backspace.
Paste Support: Users can paste a full OTP string, which will populate the input fields automatically.
Error Handling: Displays an error message when validation fails.
Inline Display: Can display input fields inline or as separate blocks.
Do: When to Use This Component
When you need to collect OTPs for authentication or verification purposes.
When you want an input field that supports both numeric and alphanumeric OTPs.
When you need input validation and error handling built into the OTP field.
When you want to allow users to paste OTPs for convenience.
Do Not: When Not to Use This Component
When you don't need individual OTP boxes or a visual distinction between characters.

Props for OTPInput
Property
Description
length
Number of characters expected in the OTP (default is 6).
type
Type of input allowed: "numeric" or "alphanumeric".
onChange
Callback function triggered when the OTP input changes.
placeholder
Array of placeholders for each OTP input box.
className
Optional string for custom class names to apply to the OTP input container.
style
Optional object for custom inline styles.
label
Label text displayed above the OTP input boxes.
inline
Boolean flag to display OTP inputs inline. Default is false (stacked view).
masking
Masks the OTP input with “.”, Default value is false

How to Use the OTPInput Component



const Component = () => {
const [otp, setOtp] = useState("");

//Example onChange logic
const handleOtpChange = (value) => {
setOtp(value);
if (value.length === args.length) {
const isValid = value.includes(1);
if (isValid) {
console.log("OTP is correct");
return null;
} else {
console.log("Invalid OTP");
return "Invalid OTP";
}
}
return null;
};
return <OTPInput length={6} type="numeric" onChange={handleOtpChange} placeholder={"123456"} label="Enter OTP" inline={false} className="" style={{ }} />;
};

                                                           
	                                    Figure 1.17.1 : OTPInput With Inline true  
			                         Figure 1.17.2 : OTPInput 	

                                                   Figure 1.17.3 : OTPInput With Placeholder


For more Information Visit : OTPInput

1.18 Panels

Overview
The Panels component is designed to display various types of messages (e.g., success, error) with an optional animation, icon, and additional information or responses. It is highly customizable, allowing you to define the type of message (success or error), custom icons, animations, and additional textual information or responses. The component also adapts to different device types (mobile, tablet, desktop) to provide an optimal visual experience.
Key Features
Message Types: Supports "success" and "error" message types.
Custom Icons: Option to provide custom icons for success and error states.
Animations: Displays animations or static SVG icons based on configuration.
Responsive Design: Automatically adjusts size and layout based on the device type (mobile, tablet, desktop).
Customizable: You can modify styles, provide additional responses, and customize icon colors and sizes.
Do: When to Use This Component
When you need to display a message indicating success or failure to the user.
When you want to enhance user experience by providing custom icons or animations.
When you need to show additional details or multiple responses along with a primary message.
When you want the component to adjust dynamically to different device screen sizes.
Do Not: When Not to Use This Component
When you require very complex interactions or custom controls beyond message display.
When displaying a very minimal or basic message that doesn't require an icon or animation.
Props for Panels
Property
Description
className
Optional string for custom class names for the wrapper.
message
The main message to display inside the panel.
type
Type of message to show ("success" or "error").
info
Additional informational text to display below the message.
response
A secondary response text to display.
customIcon
Custom icon name to display instead of the default icon or animation.
iconFill
Fill color for the custom icon.
style
Optional object for inline styles to apply to the wrapper.
multipleResponses
An array of additional responses to display below the main response.
animationProps
Object to configure animation properties such as width, height, loop, autoplay.
showAsSvg
A boolean flag indicating whether to display the message icon as an SVG instead of animation.

How to Use the Panels Component

<Panels
  animationProps={{
    loop: false,
    noAutoplay: false
  }}
  className=""
  customIcon=""
  iconFill=""
  info="Ref ID "
  message="Success Message!"
  multipleResponses={[]}
  response="949749795479"
  style={{}}
/>


<Panels
  animationProps={{
    height: 100,
    loop: true,
    noAutoplay: false,
    width: 100
  }}
  className=""
  customIcon=""
  iconFill=""
  info="Ref ID "
  message="Success Message!"
  multipleResponses={[]}
  response="949749795479"
  style={{}}
/>



<Panels
  animationProps={{
    loop: false,
    noAutoplay: false
  }}
  className=""
  customIcon=""
  iconFill=""
  info="Ref ID "
  message="Success Message!"
  multipleResponses={[
    '949749795469',
    '949749795579',
    '949749795499'
  ]}
  response="949749795479"
  style={{}}
/>


                                                            Figure 1.18.1 : Success Panel 
                                           Figure 1.18.2 : Error Panel With MultipleResponseIds


For more Information Visit : Panels

1.19 RadioButtons

Overview
The RadioButtons component is a React component that renders a list of radio button options, allowing users to select one option from a predefined set. It supports customization options such as vertical alignment, dynamic labels, and dependency handling between options. This component can be integrated into forms, filters, or any selection process where users need to pick one item from a group.
Key Features
Customizable Options: It supports various options through props, allowing dynamic content display.
Vertical or Horizontal Alignment: The component can display radio buttons vertically or horizontally based on the alignVertical prop.
Dynamic Labels: Uses a key from each option or a dependent key for labeling, making it easy to localize with translation support.
Disabled Options: Can handle preselected and disabled options, providing clear UI states.
Dependent Options: It can manage options that rely on other selections via isDependent for flexible use cases.
Do: When to Use This Component
Use when you need a single-choice input where users can only select one option from multiple choices.
Use in forms or surveys where specific inputs require distinct options.
Use if you need dynamic or translated labels for each option.
Do Not: When Not to Use This Component
Do not use if you need multiple selections; instead, consider using checkboxes.
Avoid using if the number of options is too large, making it difficult for users to easily view or select.
Do not use when the choices should be displayed without the need for interaction or selection.

Props for RadioButtons
Property
Description
selectedOption
The currently selected option.
onSelect
Function to call when an option is selected.
options
The list of options to display in the radio buttons.
optionsKey
The key in the option object to be used for labeling the radio buttons.
innerStyles
Inline styles to apply to the internal elements.
style
Inline styles to apply to the main container of the radio buttons.
alignVertical
Boolean that controls if the radio buttons are displayed vertically or horizontally.
additionalWrapperClass
Additional CSS class to apply to the wrapper for styling.
disabled
Boolean to disable interaction with the radio buttons.
name
The name attribute for the radio buttons, useful for form submissions.
inputRef
The name attribute for the radio buttons, useful for form submissions.
inputStyle
Inline styles to apply to the label of each radio button.
isDependent
Boolean that specifies if the options depend on some other data.
labelKey
A key to be used to generate dynamic labels in dependent options.
value
The current value to compare against each option, determining if it is selected or disabled.
isLabelFirst
Boolean to show label before radio button
inputStyle
Custom styles for label
labelKey
Adds before label


How to Use the RadioButtons Component


                                                           Figure 1.19.1 : RadioButtons
                                                    Figure 1.19.2 : Pre Selected RadioButtons


For more Information Visit : RadioButtons

1.20 SelectionTag

Overview
The SelectionTag component is a versatile card-style selection tool that allows users to select one or more options from a list. Each option can have icons (prefix/suffix), and the component supports dynamic error messages. It is flexible for both single and multiple selections, making it suitable for forms or interactive interfaces.
Key Features
Supports single and multiple selections.
Customizable icons for options (prefix and suffix).
Shows error messages with an optional truncation.
Utilizes translation for error messages.
Responsive design with customizable width for each option.
Do: When to Use This Component
Use when you want users to select from a list of options.
Great for scenarios that require dynamic error feedback.
Useful when multiple or single selections are allowed.
Do Not: When Not to Use This Component
Do not use if selection is not required.
Avoid using when there is no need for customization (icons, styling).
If you need complex interactions (beyond selection), consider another component.
Props for SelectionTag Component

Property
Description
width
Width of each option tag
errorMessage
Message to be shown as error
options
The list of options to display in the selection tag.
onSelectionChanged
Call back function called when selection changes
allowMultipleSelection
Boolean flag to check whether to allow multiple option selections, Default value is true
selected
Default selected options array
withContainer
Boolean that controls whether to add a container around or not


How to Use the SelectionTag Component

<SelectionTag
  allowMultipleSelection
  errorMessage=""
  onSelectionChanged={function noRefCheck(){}}
  options={[
    {
      code: 'option1',
      name: 'Option 1',
      prefixIcon: 'Edit',
      suffixIcon: 'Edit'
    },
    {
      code: 'option2',
      name: 'Option 2',
      prefixIcon: 'Edit',
      suffixIcon: 'Edit'
    },
    {
      code: 'option3',
      name: 'Option 3',
      prefixIcon: 'Edit',
      suffixIcon: 'Edit'
    }
  ]}
  selected={[]}
  width=""
/>

                               Figure 1.20.1 : SelectionTag with both prefix and suffix icons
                               Figure 1.20.2 : SelectionTag with pre selected option


For more Information Visit :  SelectionTag

1.21 Stepper

Overview
The Stepper component provides a user-friendly way to display progress through a series of steps in a process. It is highly customizable and can adapt to different layouts (horizontal or vertical). Users can interact with steps by clicking on them, and the component supports dynamic updates and mobile responsiveness.
Key Features
Interactive Steps: Users can click on steps to navigate.
Custom Labels: Define your own step labels or use default step numbering.
Dynamic Styling: Mark steps as active, completed, or current.
Horizontal or Vertical Layouts: Choose between layouts with optional dividers.
Mobile Responsiveness: Adapts to mobile screens automatically.
Smooth Scrolling: Automatically scrolls the current step into view.
Custom Actions: Allows dynamic updates to active steps or step labels.
Do: When to Use This Component
Use for processes that involve multiple steps, such as forms, tutorials, or wizards.
Ideal for workflows where users need to see progress or navigate between steps.
When steps have sequential or non-linear navigation.
Do Not: When Not to Use This Component
Avoid using for single-step tasks where progress tracking is unnecessary.
Do not use if the number of steps is excessively large and would clutter the UI.
Not ideal for situations where steps are not clearly defined or need complex branching.
Props for Stepper
Property
Description
currentStep
The currently active step (1-based index).
onStepClick
Function triggered when a step is clicked. Receives the step index as a parameter.
totalSteps
Total number of steps in the stepper.
customSteps
An object mapping step indexes to custom labels.
direction
Layout direction: "horizontal" or "vertical".
style
Inline styles for the stepper container.
className
Additional class names for custom styling.
activeSteps
The number of steps considered active (e.g., for multi-step progress).
hideDivider
If true, hide the divider in vertical mode.
props
Other props, which contains labelStyles


How to Use the Stepper Component

<Stepper
  activeSteps=""
  currentStep={1}
  customSteps={{}}
  direction="horizontal"
  onChange={()=>{}}
  onStepClick={()=>{}}
  populators={{
    name: 'stepper'
  }}
  props={{
    labelStyles: {}
  }}
  style={{}}
  totalSteps={5}
/>

                                                       Figure 1.21.1 : Horizontal Stepper
Figure 1.21.2 : Vertical Stepper With Divider


For more Information Visit : Stepper

1.22 StringManipulator

Overview

The StringManipulator component is a utility function that allows dynamic string formatting. It supports converting text to sentence case, title case, capitalizing the first letter, and truncating strings. This is useful for formatting text dynamically in UI components, labels, and messages.
Key Features
Convert text to different cases (sentence case, title case, capitalize first letter).
Truncate long text dynamically.
Configurable based on global settings (can be turned on/off).
Lightweight and easy to use.
Do: When to Use This Component
When text formatting needs to be consistent across the UI.
When truncating long text to fit in limited space (e.g., table columns, tooltips).
When applying case transformations to user-generated content.
Do Not: When Not to Use This Component
Do not use if raw strings should be displayed without modifications.
Avoid using if the global setting IS_STRING_MANIPULATED is disabled, as it won’t modify text.
Props for StringManipulator
Property
Description
functionName
The type of string transformation to apply (TOSENTENCECASE, CAPITALIZEFIRSTLETTER, TOTITLECASE, TRUNCATESTRING).
key
The string that needs to be formatted.
props
An object containing additional properties like maxLength (for truncation).


How to Use the StringManipulator Component

{StringManipulator(
              "TOSENTENCECASE",
              StringManipulator("TRUNCATESTRING", “exampleleeeeeeeeeeeeee”, {
                maxLength: 64,
              })
)}

                                          
1.23 SummaryCardFieldPair

Overview
The SummaryCardFieldPair component is designed to display a label and value pair in a structured format, such as in a card layout or a summary view. It allows you to customize the appearance by showing the label and value in either a vertical or horizontal (inline) layout. This component is useful for presenting key-value pairs of data, such as in a profile, summary, or card view.
Key Features
Displays a label and its corresponding value.
Supports inline or vertical (stacked) display.
Customizable with additional styles and class names.
Do: When to Use This Component
Use this component when you need to display paired information (e.g., "Name: John Doe") in a view card format.
Use it in summary pages, profile views, or when presenting key-value data in a clear and organized way.
Do Not: When Not to Use This Component
Do not use this component when you need editable fields; it's for display purposes only.
Avoid using it for displaying large amounts of text or complex data that require more detailed formatting.
Props for SummaryCardFieldPair
Property
Description
label
The label text to display.
value
The value associated with the label.
inline
Boolean to display the label and value inline or stacked.
className
Additional CSS class names for custom styling.
style
Inline styles to customize the appearance of the component.
type
Type of the field value content
renderCustomContent
If type is “custom”, this call back will be called with value.


How to Use the SummaryCardFieldPair Component

  <SummaryCardFieldPair
    className=""
    inline={true}
    label="Label"
    style={{}}
    value="Value"
  />

                                          Figure 1.23.1 : SummaryCardFieldPair Inline
			       Figure 1.23.2 : SummaryCardFieldPair 


For more Information Visit : SummaryCardFieldPair

1.24 Switch

Overview
The Switch component is a customizable toggle switch that allows users to switch between two states (on/off). It can display a label, supports custom styling, and includes optional on/off shapes. It is also keyboard accessible, allowing users to toggle the switch using the Enter or Space keys.
Key Features
Customizable label position (before or after the switch).
Optional shapes for on/off states.
Initial state configuration (checked or unchecked).
Callback function to handle state changes.
Can be disabled to prevent interaction.
Do: When to Use This Component
Use for toggling between two states like on/off or enabled/disabled.
Use when you want a visual switch for simple true/false values.
When accessibility is important (keyboard interactions).
Do Not: When Not to Use This Component
Avoid using for complex selection tasks or for selecting between more than two options.
Do not use if the switch functionality does not directly impact the user’s interaction (use a different control like a checkbox for passive information).
Props for SwitchComponent

Property
Description
isLabelFirst
Boolean flag to show label first. Default value is false
label
Label for switch
shapeOnOff
Boolean flag to show shapes inside switch. Default value is false
isCheckedInitially
Initial Check value. Default value is false
onToggle
Callback function when switch state changes.
className
Custom class name for the class “digit-switch-container”
style
Custom styles for “digit-switch-container”
disable
Boolean to disable the switch. Default value is false
switchStyle
Custom style for the class “digit-switch”


How to Use the Switch Component

<Switch
  isLabelFirst={true}
  label="Enable notifications"
  shapeOnOff={true}
  isCheckedInitially={false}
  onToggle={(state) => console.log("Switch is now:", state)}
  className=""
  style={}
  disable={false}
/>



Figure 1.24.1 : Switch with off shape 


Figure 1.24.2 : Switch with on shape


For more Information Visit : Switch

1.25 Tab
Overview
The Tab component allows for the creation of a tabbed navigation interface. It can be used to display multiple tabs, each associated with different content, and provides an easy way for users to switch between views. This component supports customizable styles, icons, and dynamic tab items, making it flexible for different design needs. It also handles navigation and provides callbacks for when a tab is clicked.
Key Features
Dynamic Tabs: Tabs are generated dynamically based on an array of configuration items.
Icon Support: Each tab can optionally display an icon along with the label.
Customizable Styles: Supports custom styles for both the tab container and individual items.
Active State: The component tracks and highlights the currently active tab.
Callback Function: An onTabClick callback is provided to handle actions when a tab is clicked.
Auto-resizing Tabs: The width of each tab adjusts to the widest tab, ensuring uniformity.
Do: When to Use This Component
Use this component to create navigable tabs where users can switch between different views or sections.
When you need an interface to manage multiple related contents under different tabs (e.g., settings, categories, etc.).
Ideal when you require customizable tab items that include icons.
Do Not: When Not to Use This Component
Avoid using this component when you only have a single section or view. Tabs make sense only when there’s more than one option.
Don’t use if your application’s flow requires linear navigation (e.g., a step-by-step process).
Props for Tab
Property
Description
configNavItems
Array of objects defining the tab items. Each item may contain a name, code, and icon.
configItemKey
The key from each item in configNavItems that should be displayed as the label in the tab.
activeLink
The currently active tab (represented by its code).
setActiveLink
Function to update the active tab when a tab is clicked.
showNav
Boolean to show or hide the navigation bar.
style
Inline style object for the tab container.
navStyles
Inline style object for the navigation container.
itemStyle
Inline style object for each individual tab item.
className
Additional class names for the tab container.
navClassName
Additional class names for the navigation container.
onTabClick
Callback function invoked when a tab is clicked. Passes the clicked tab's data.
children
Children to be rendered inside Tab Component
configDisplayKey
Key to be shown as label for the Tab item


How to Use the Tab Component
<Tab
  activeLink="Tab one"
  configItemKey="name"
  configNavItems={[
    {
      code: '1',
      name: 'Tab one'
    },
    {
      code: '2',
      name: 'Tab two'
    },
    {
      code: '3',
      name: 'Tab three'
    },
    {
      code: '4',
      name: 'Tab four'
    }
  ]}
  itemStyle={{}}
  navStyles={{}}
  onTabClick={() => {}}
  setActiveLink={()=>{}}
  showNav
  style={{}}
/>


		                                               Figure 1.24.1 : Tabs 
					 Figure 1.24.2 : Tab With Icons


For more Information Visit : Tab


1.25 Tag

Overview
The Tag component is a versatile UI element used to display labels, tags, or statuses. It supports custom icons, different styles such as error, warning, and success, and provides options for customization through props like stroke, alignment, and onClick. This component is useful when you need to present brief contextual information with optional visual feedback (e.g., success or error).
Key Features
Customizable label and icon
Multiple tag types: monochrome, success, error, warning
Optional stroke around the tag
Clickable option with a callback function
Icon alignment and color customization
Do: When to Use This Component
To label or categorize content in your UI.
When displaying statuses such as success, error, or warning.
When you need interactive tags with clickable behavior.
Do Not: When Not to Use This Component
Avoid using for large blocks of content; this component is designed for short, concise labels.
Not suitable for situations where no visual feedback or status is necessary.
Props for Tag
Property
Description
className
Custom class name for additional styling.
iconClassName
Class name for the custom icon.
iconColor
Custom color for the icon.
label
The text displayed within the tag (required).
style
Custom styles for the tag container.
stroke
Boolean to apply a border around the tag.
type
Type of tag, supports: monochrome, success, error, warning.
showIcon
Boolean to show or hide the icon (default: true).
labelStyle
Custom styles for the label text.
onClick
Callback function triggered when the tag is clicked.
alignment
Alignment of the content inside the tag, e.g., center, left, right.
icon
Custom icon to show inside tag


How to Use the Tag Component

<Tag
  icon=""
  label="Tag With icon & stroke"
  labelStyle={{}}
  stroke
  style={{}}
  type="success"
/>





Figure 1.25.1 : Success Tag With Icon and Stroke





Figure 1.25.2 : Warning Tag With Icon and Stroke





Figure 1.25.3 : Error Tag With Icon and Stroke


Figure 1.25.4 : Monochrome Tag With Icon and Stroke



For more Information Visit : Tag

1.26 TextArea

Overview
The TextArea component is a multi-line input field designed for users to enter long-form text. It supports dynamic resizing, custom styling, validation, and accessibility features.
Key Features
Smart Resizing – Automatically adjusts height based on content.
Custom Placeholder Support – Uses StringManipulator for text formatting.
Min & Max Length Constraints – Controls text length within a defined range.
Validation Support – Enforces input patterns with customizable error handling.
Accessibility Features – Supports non-editable states, disabled mode, and autocomplete.
Customizable Styles – Allows adding custom classes and styles.
Do: When to Use This Component
When users need to enter multi-line text (e.g., comments, descriptions).
When requiring smart resizing to fit content dynamically.
When validating text input (e.g., limiting characters or enforcing patterns).
When providing custom placeholders and styling.
Do Not: When Not to Use This Component
When needing rich text editing (this only supports plain text).
When needing text formatting options like bold, italic, or bullet points.
Props for TextBlock
Property
Description
populators
Object contains resizeSmart key : smart resize of textarea
placeholder
Placeholder text shown inside the textarea.
name
The name attribute of the textarea.
inputRef
Reference to the textarea input element.
style
Custom inline styles.
id
Unique identifier for the textarea.
value
The current value of the textarea.
className
Custom class for styling.
disabled
If true, makes the textarea disable.
nonEditable
If true, makes the textarea non-editable.
error
Displays an error message when validation fails.
minlength
Minimum length of input text.
maxlength
Maximum length of input text.
ValidationRequired
If true, enables validation enforcement.
validation
Custom validation object. Contains pattern key 
pattern
Regular expression pattern for validation.
onChange
Function triggered when text is changed.


How to Use the TextBlock Component

<TextArea 
  placeholder="Enter your comments..."
  name="userComments"
  populators={resizeSmart:true}
  onChange={(e) => console.log(e.target.value)}
/>


                                                                Figure 1.26.1 : TextArea

For more Information Visit : TextArea

1.27 TextBlock

Overview
The TextBlock component is a flexible content block that displays a combination of caption, header, subheader, and body text. It allows you to style each of these elements individually with custom class names and styles. This component is ideal for displaying structured text content, such as titles and descriptions, in a clean, organized way.
Key Features
Supports a combination of text elements: caption, header, subheader, and body.
Customizable class names for each text section, allowing easy styling.
Flexible layout for different content types and structures.
Do: When to Use This Component
When you need to display a block of text content with multiple sections (e.g., title, subtitle, body).
When you need to customize the appearance of the caption, header, and body text with different styles.
To organize content sections in a readable and structured way.
Do Not: When Not to Use This Component
Avoid using this component if you only need a simple paragraph or one-line text element.
Do not use this component when the content layout does not require multiple sections like headers, captions, and body.
Props for TextBlock
Property
Description
wrapperClassName
Custom class name for the wrapper container of the whole block.
headerContentClassName
Class name for the header content wrapper (includes caption, header, and subheader).
caption
Text content for the caption section (usually smaller text or description).
captionClassName
Class name for the caption text.
header
Main header text (typically the title).
headerClasName
Class name for the header text.
subHeader
Subheader text (optional additional information below the header).
subHeaderClasName
Class name for the subheader text.
body
The body text content (main content or description).
bodyClasName
Class name for the body text.
style
Inline styles to apply to the wrapper of the component.


How to Use the TextBlock Component

<TextBlock caption="Note" header="Important Information" subHeader="Please read carefully" body="Make sure to follow the guidelines." wrapperClassName="custom-wrapper" captionClassName="custom-caption" headerClasName="custom-header" subHeaderClasName="custom-subheader" bodyClasName="custom-body" />


                                                                Figure 1.27.1 : TextBlock

For more Information Visit : TextBlock
 		
1.28 TextInput

Overview
The TextInput component is a flexible and customizable input field that supports various input types such as text,text with prefix, text with suffix, password, numeric, date,location, and search. It includes additional functionalities like prefix/suffix, numeric increment/decrement buttons, visibility toggle for passwords, and geolocation retrieval.
Key Featuresime
Supports different input types (text, password, numeric, date, search, etc.)
Optional prefix/suffix for enhanced UI
Numeric inputs support increment/decrement buttons
Password inputs allow visibility toggle
Search inputs include a custom search icon
Geolocation support to fetch user location
Customizable styling and classNames
Supports form validation with required, min/max length, and patterns
Do: When to Use This Component
Use when a standard input field is required for forms
Use when validation rules (min/max length, required, pattern) need to be applied
Use when custom icons, prefix, suffix, or geolocation are needed
Use for search, numeric, date, or password input fields
Do Not: When Not to Use This Component
Avoid for multi-line text input (use a TextArea component instead)
Do not use for file uploads (use a FileUpload component instead)
Avoid when a pre-styled third-party input component is required
Props for TextInput
Property
Description
type
Input type (text, password, numeric, date, search,time,geolocation,number,mobileNumber.)
value
Current value of the input field
watch
Allows watching form values for dependent inputs
onChange
Callback function triggered when value changes
step
step count to increment or decrement in numeric counter
populators
prefix : Prefix to display before input text
suffix : Suffix to display after input text
customIcon : 
disableTextField :
nonEditable
Makes input read-only
iconFill
Icon fill color 
disabled
Disables input field
onIconSelection
Function triggered when icon is clicked
customClass
Custom class name for the input
errorStyle
Boolean flag to check if it needs error style
className
Custom class name for “digit-text-input-field”
error
Displays an error message if validation fails
textInputStyle
Custom styles for “digit-text-input-field”
required
Marks input as required
validation
type
pattern
title
ValidationRequired
Boolean to enable validation object
name
Unique name for the input field
id
Id for the input field
placeholder
Placeholder text for the input field
maxlength
Maximum allowed characters
minlength
Minimum required characters
inputRef
Reference to the input
style
Custom styles for the input
defaultValue
defaultValue of the input
max
Maximum numeric value allowed
min
Minimum numeric value allowed
pattern
Regular expression for validation
title
Title for the input
autoFocus
Enable auto focus for the input
onBlur
Function called when input loses focus
allowNegativeValues
Allows negative numbers for numeric input
onFocus
Function called when input gains focus
config
Custom configurations for input styling and behavior
signature
Enables digital signature support
signatureImg
Renders signature image if enabled


How to Use the TextInput Component

<TextInput
  name="username"
  type="text"
  placeholder="Enter your username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
/>



                                                    Figure 1.28.1 : Simple Text
                                                 Figure 1.28.2 : Text WIth Prefix
                                                 Figure 1.28.3 : Text WIth Suffix
                                                 Figure 1.28.4 : Password


                                                       Figure 1.28.5 : Numeric Counter
                                                             Figure 1.28.6 : Date

                                                         Figure 1.28.7 : Time
                                                           Figure 1.28.8 : GeoLocation
                                                           Figure 1.28.9 : Search



For more Information Visit : TextInput




1.29 Timeline

Overview
The Timeline component is designed to display a sequence of steps, events, or milestones in a timeline format. It allows for labeling each step, adding sub-elements (like dates or descriptions), showing progress states (such as completed, upcoming, or in-progress), and including additional details for each step. It also handles errors, mobile responsiveness, and allows toggling between expanded and collapsed views for additional information.
Key Features
Displays events or milestones in a clear, structured timeline format.
Supports different states like "completed", "in-progress", "upcoming", and "error".
Allows for adding sub-elements such as dates or descriptions for each step.
Includes the ability to toggle the visibility of additional details.
Mobile responsive with adaptable icons and layout.
Configurable connectors between timeline items for better visual flow.
Do: When to Use This Component
Use this component when you need to display a series of events or milestones.
Use it when you want to visualize progress for tasks or steps.
Use it if you want to add additional information that can be expanded and collapsed by the user.
Do Not: When Not to Use This Component
Do not use this component if the content is not sequential or related to steps or progress.
Avoid using this for simple or isolated information that doesn’t require a timeline format.
Props for TimelineTabne

1.30 Toast

Overview
The Toast component is a notification message that appears briefly and then disappears after a set duration. It is used to provide feedback to the user, such as success, error, warning, or informational messages. The component is customizable, allowing for different types of toasts, transition times, and button configurations for warnings. It also has a close button that the user can manually click to dismiss the toast.
Key Features
Display different types of notifications: success, error, warning, and info.
Automatic dismissal after a specified time (transitionTime).
Manual dismissal using a close button.
Option to show confirmation buttons (Yes/No) for warnings.
Responsive to animation, ensuring smooth transitions.
Do: When to Use This Component
Use the Toast component to notify users of actions that are completed successfully.
Use it to inform users of errors, warnings, or informational messages that don’t require major attention.
It's great for temporary messages that don’t require a user’s continued interaction.
Do Not: When Not to Use This Component
Avoid using this component for critical messages that require the user’s full attention or immediate action.
Do not use this if the user needs to interact with the notification for an extended period, as it automatically disappears after a set time.
Props for Toast
Property
Description
label
The message displayed in the toast.
onClose
Function called when the toast is dismissed, either manually or after the timeout.
isDleteBtn
Boolean to show a delete button on warning toasts.
transitionTime
Time (in milliseconds) before the toast automatically disappears (default is 5000ms).
type
Type of toast to display, can be success, error, warning, or info.
style
Custom styles for the toast container.
labelstyle
Custom styles for the label text inside the toast.
isWarningButtons
Boolean to show Yes/No buttons for warnings (used for confirmation prompts).
onYes
Function called when the "Yes" button is clicked in a warning toast.
onNo
Function called when the "No" button is clicked in a warning toast.
variant
Custom class name for “digit-toast-success”

How to Use the Toast Component

  <Toast
    label="Success Toast Message"
    populators={{
      name: 'toast'
    }}
    style={{}}
    transitionTime={600000}
    type="success"
  />

                                              Figure 1.30.1 : Success Toast Message
                                               Figure 1.30.2 : Warning Toast Message
                                                Figure 1.30.3 : Error Toast Message
                                                 Figure 1.30.4 : Info Toast Message


For more Information Visit : Toast

1.31 Toggle
Overview
The Toggle component is a radio button-based toggle switch that allows users to switch between multiple predefined options. It is useful for scenarios where only one option can be selected at a time.
Key Features
Radio-style toggle selection – Only one option can be selected at a time.
Customizable labels – Supports internationalization via i18next.
Automatic width adjustment – Adapts label width dynamically.
Disabled state – Prevents user interaction when needed.
Custom styling – Supports additional CSS classes and styles.
Do: When to Use This Component
When you need a switch-like radio button with multiple options.
When the number of options is fixed and limited.
When only one option can be selected at a time.
When requiring localization (i18n) for option labels.
Do Not: When Not to Use This Component
When multiple options can be selected simultaneously (use checkboxes instead).
When needing a complex dropdown or select menu.
When using long labels, space is limited.

Props for Toggle
Property
Description
selectedOption
The currently selected option (default is the first option).
onSelect
Callback function triggered when an option is selected.
options
List of options available for selection.
optionsKey
Key used to extract labels from the options array.
additionalWrapperClass
Custom class name for additional styling.
disabled
Disables the toggle, preventing selection.
inputRef
Reference to the input field.
style
Custom CSS styles for the toggle wrapper.
name
Name for the input “digit-toggle-input”


How to Use the Toggle Component

<Toggle
  additionalWrapperClass=""
  errorStyle={null}
  innerStyles={{}}
  inputRef={null}
  label=""
  name="toggleOptions"
  numberOfToggleItems={3}
  onChange={function noRefCheck(){}}
  onSelect={function noRefCheck(){}}
  options={[
    {
      code: 'Toggle1',
      name: 'Toggle 1'
    },
    {
      code: 'Toggle2',
      name: 'Toggle 2'
    },
    {
      code: 'Toggle3',
      name: 'Toggle 3'
    }
  ]}
  optionsKey="name"
  selectedOption=""
  style={{}}
  t={()=>{}}
  type="toggle"
  value=""
/>




Figure 1.31.1 : Toggle

For more Information Visit : Toggle

1.32 Tooltip

Overview
The Tooltip component is a small pop-up that appears when a user hovers over or focuses on an element. It provides additional information about an item or feature in a non-intrusive way. The Tooltip component allows you to customize the content, position, and appearance, with options to add headers, descriptions, and even an arrow pointing to the target element.
Key Features
Customizable Content: Display any kind of content, including headers, descriptions, and rich data.
Positioning: Place the tooltip in different positions around the target element, such as top, bottom, left, or right.
Arrow Support: Option to display an arrow pointing to the target element for better visual guidance.
Theme Support: Choose between themes (e.g., dark, light) to match your application's design.
Responsiveness: Works seamlessly with different screen sizes and orientations.
Do: When to Use This Component
Use the Tooltip component to provide extra information or context about an element without cluttering the UI.
It’s great for explaining unfamiliar terms, labels, or controls in your interface.
Use it when you want to avoid large amounts of text but still provide details on-demand.
Do Not: When Not to Use This Component
Avoid using the Tooltip component for critical or essential information that the user must see immediately.
Do not use tooltips for content that requires interaction or is too complex, as tooltips are meant for quick reference.

Props for Tooltip
Property
Description
header
A title or heading to be displayed at the top of the tooltip.
content
The main content of the tooltip, required. This can be text or any JSX element.
description
A short description to provide additional context, displayed below the main content.
placement
Controls where the tooltip appears in relation to the target element. Options include bottom, top, left, right, etc.
arrow
Whether or not to show an arrow pointing to the target element (default: true).
theme
Defines the theme or style of the tooltip. Common options include dark (default) and light.
style
Custom inline styles for the tooltip container.
className
Custom class name for additional CSS styling.
tooltipRef
A ref to handle the tooltip DOM node if you need to programmatically control its visibility or position.


How to Use the Tooltip Component

  <Tooltip
    arrow={true}
    className=""
    content={<>And here's some amazing content It's very engaging. Right?<hr /><img alt="here is your logo" src="https://egov-dev-assets.s3.ap-south-1.amazonaws.com/digit.png"/></>}
    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt "
    header="Header"
    style={{}}
  />







Figure 1.32.1 : Dark theme Tooltip with header, content and description





















Figure 1.32.2 : Light theme Tooltip with header, content and description





For more Information Visit : Tooltip

Molecules

2.1 BottomSheet

Overview
The BottomSheet component is a draggable, resizable, and interactive sheet that appears from the bottom of the screen. It's commonly used to display additional content or actions in a small, collapsible area, often on mobile devices. The BottomSheet can snap to various heights (such as closed, quarter, intermediate, and full) depending on user interaction, and it can optionally include action buttons at the bottom.
Key Features
Resizable and Draggable: Users can drag the sheet to adjust its height, and it will snap to predefined positions (closed, quarter, intermediate, full).
Snap to State: Automatically adjusts to the nearest state (e.g., closed, intermediate) when dragging stops.
Action Buttons: Can display customizable action buttons that appear at the bottom of the sheet.
Responsive Design: The sheet adapts to different screen sizes and can be customized to fit your design.
Do: When to Use This Component
Use this component when you need to display secondary content that doesn't need to be on the main screen.
It’s ideal for mobile devices where users can drag the sheet up and down to reveal or hide content.
Use when you need to show options, filters, or actions without navigating away from the current screen.
Do Not: When Not to Use This Component
Don’t use the BottomSheet for displaying essential content that should always be visible on the main screen.
Avoid using it for complex, primary navigation; it's meant to show additional, not primary content.

Props for BottomSheet

Property
Description
children
The content to be displayed inside the BottomSheet.
initialState
The initial state of the sheet (e.g., "closed", “fixed”,”quarter”, "intermediate","full").Default value is “closed”
enableActions
If true, actions (buttons) will be enabled and displayed at the bottom.
actions
The list of action buttons or elements to be displayed at the bottom.
equalWidthButtons
If true, the action buttons will be of equal width.
className
Custom CSS class for additional styling of the component..
style
Inline styles to customize the component’s appearance.



How to Use the BottomSheet Component
Basic Usage: To use the BottomSheet component, import it into your React project, and pass the required props. 

Adding Actions: To include actions (such as buttons), use the enableActions and actions props. This will display the buttons at the bottom of the sheet.


Customizing State and Style: You can control the initial state and add custom styles or classes

Example: 



<BottomSheet
  actions={[
    <Button key="1" label="Cancel" variation="secondary"/>,
    <Button key="2" label="Submit"/>
  ]}
  className=""
  enableActions
  initialState="closed"
  style={{}}
>
  <AlertCard
    label="Info"
    populators={{
      name: 'alertcard'
    }}
    text="Application process will take a minute to complete. It might cost around Rs.500/- to Rs.1000/- to clean your septic tank and you can expect the service to get completed in 24 hrs from the time of payment."
    variant="default"
  />
  <img
    alt="Additional Element 2"
    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIGMLufj86aep95KwMzr3U0QShg7oxdAG8gBPJ9ALIFQ&s"
  />
  <AlertCard
    label="Info"
    populators={{
      name: 'alertcard'
    }}
    text="Application process will take a minute to complete. It might cost around Rs.500/- to Rs.1000/- to clean your septic tank and you can expect the service to get completed in 24 hrs from the time of payment."
    variant="default"
  />
</BottomSheet>




                            Figure 2.1.1 : BottomSheet With EqualWidth Actions Buttons Enabled  


For more Information Visit : BottomSheet


2.2 ButtonGroup


Overview
The ButtonGroup component is used to render a collection of buttons in a responsive and customizable way. It ensures consistent sizing of buttons, provides a sorting mechanism, and adapts to mobile or desktop views for optimal usability. The component allows developers to manage button arrangements dynamically based on device width and preferences.
Key Features
Responsive Design: Automatically adapts button display for mobile and desktop views.
Consistent Button Sizing: Dynamically adjusts button width to ensure consistency.
Sorting Capability: Sorts buttons based on their variation type (primary, secondary, tertiary).
Customizable Layout: Allows toggling sorting and displays buttons in an order tailored for different devices.
Do: When to Use This Component
Use this component when you have multiple buttons and need consistent styling.
Use it for mobile-friendly interfaces to ensure buttons are displayed properly on smaller screens.
Use it when buttons need to be sorted based on their priority (e.g., primary, secondary, tertiary).
Do Not: When Not to Use This Component
Do not use this component for a single button; use the Button component instead.
Avoid using this component for non-button elements, as it is tailored for buttons only.
Props for ButtonGroup Component
Property
Description
buttonsArray
An array of Button components to be displayed.
sortButtons
A boolean to enable sorting of buttons based on their variation type.
equalButtons
Make all the buttons of equal width


How to Use the ButtonGroup Component

 <ButtonGroup
  buttonsArray={[
    <Button label="ButtonPrimary" onClick={()=>{}} type="button" variation="teritiary"/>,
    <Button label="ButtonPrimary" onClick={()=>{}} type="button"/>,
    <Button label="Buttons" onClick={()=>{}} type="button" variation="secondary"/>
  ]}
  sortButtons
/>


 Figure 2.2.1 : ButtonGroup with Unsorted Buttons

Figure 2.2.2 : ButtonGroup with Sorted Buttons


For more Information Visit : ButtonGroup


2.3 Card
2.3.1 Basic Card
Overview
The Card component is a simple yet flexible container that can be used to display content in a structured way. It can be customized with different styles, variants, and click interactions. It acts as a wrapper for content, providing a styled container that adapts to different use cases.
Key Features
Customizable with different styles and variants
Supports click interactions
Can be used as a wrapper for different types of content
Works well with other UI components
Do: When to Use This Component
Use when you need a structured container for displaying content
Use for creating dashboard widgets, profile cards, info boxes, etc.
Use when you want a card that supports click interactions
Do Not: When Not to Use This Component
Do not use for displaying large amounts of text (use a modal or separate page instead)
Do not use when a simple div is enough (e.g., minor UI elements)
Avoid unnecessary nesting of multiple Card components
Props for Card

Property
Description
type
Defines the type of card (e.g., "primary", "secondary").
variant
Specifies different styling variations of the card.
onClick
Function to execute when the card is clicked.
style
Custom styles applied to the card.
className
Additional class names for styling.
children
The content inside the card.
ReactRef
A reference to the card for direct DOM manipulation.



How to Use the Card Component

Example: 


<Card type="primary">
  <TextArea
    populators={{
      resizeSmart: true
    }}
    type="textarea"
  />
  <MultiSelectDropdown
    addSelectAllCheck
    onSelect={function noRefCheck(){}}
    options={[
      {
        code: 'MALE',
        name: 'MALE'
      },
      {
        code: 'FEMALE',
        name: 'FEMALE'
      },
      {
        code: 'TRANSGENDER',
        name: 'TRANSGENDER'
      }
    ]}
    optionsKey="code"
    selected={[
      {
        code: 'MALE',
        name: 'MALE'
      },
      {
        code: 'FEMALE',
        name: 'FEMALE'
      },
      {
        code: 'TRANSGENDER',
        name: 'TRANSGENDER'
      }
    ]}
  />
  <Dropdown
    option={[
      {
        code: 'MALE',
        name: 'MALE'
      },
      {
        code: 'FEMALE',
        name: 'FEMALE'
      },
      {
        code: 'TRANSGENDER',
        name: 'TRANSGENDER'
      }
    ]}
    optionKey="code"
    select={function noRefCheck(){}}
    selected={{
      code: 'FEMALE',
      name: 'FEMALE'
    }}
  />
  <AlertCard
    label="Info"
    populators={{
      name: 'infocard'
    }}
    text="Application process will take a minute to complete. It might cost around Rs.500/- to Rs.1000/- to clean your septic tank and you can expect the service to get completed in 24 hrs from the time of payment."
    variant="default"
  />
  <Button
    label="Button"
    type="button"
  />
  <Button
    label="Button"
    size="medium"
    type="button"
  />
  <Button
    label="Button"
    size="small"
    type="button"
  />
  <Button
    label="Button"
    type="button"
    variation="secondary"
  />
  <Button
    label="Button"
    size="medium"
    type="button"
    variation="secondary"
  />
  <Button
    label="Button"
    size="small"
    type="button"
    variation="secondary"
  />
  <Button
    label="Button"
    type="button"
    variation="teritiary"
  />
  <Button
    label="Button"
    size="medium"
    type="button"
    variation="teritiary"
  />
  <Button
    label="Button"
    size="small"
    type="button"
    variation="teritiary"
  />
  <Button
    label="link"
    type="button"
    variation="link"
  />
  <Button
    label=" link"
    size="medium"
    type="button"
    variation="link"
  />
  <Button
    label="link"
    size="small"
    type="button"
    variation="link"
  />
</Card>






                                                                 Figure 2.3.1.1 : Card

For more Information Visit : Card




2.3.2 Form Card
Overview
The FormCard component is a structured container designed to organize form-related elements. It allows for a flexible grid layout, optional headers and footers, and dividers between elements. This component is useful for creating structured forms with a responsive design that adapts to different screen sizes.
Key Features
Supports custom layouts (rows and columns) using a layout prop
Provides an optional header and footer for additional information or actions
Responsive design that adapts to mobile and desktop views
Configurable dividers to visually separate form elements
Allows equal-width buttons in the footer
Do: When to Use This Component
Use when you need a structured layout for forms
Use when designing multi-column form layouts
Use when you need a consistent look for form elements
Use when you require a responsive form container
Do Not: When Not to Use This Component
Do not use when you only need a simple form wrapper (use a basic div instead)
Do not use for large, multi-step forms (consider using a stepper or modal-based approach)
Props for FormCard

Property
Description
type
Specifies the type of form card.
style
Custom styles applied to the card.
className
Additional CSS classes for styling.
children
Form elements to be wrapped inside the FormCard.
layout
Defines the number of rows and columns in the format "rows*columns". Example: "1*2" for 1 row and 2 columns.
headerData
Content for the header section (e.g., form title or description).
equalWidthButtons
If true, buttons in the footer will have equal width.
withDivider
If true, vertical dividers are added between elements in the grid layout.
footerData
Content for the footer section, typically buttons or additional information.



How to Use the FormCard Component

Example: 


<FormCard
  equalWidthButtons
  footerData={[
    <Button icon="" label="Cancel" onClick={function noRefCheck(){}} type="button" variation="secondary"/>,
    <Button icon="" label="Submit" onClick={function noRefCheck(){}} type="submit"/>
  ]}
  headerData={[
    <TextBlock header="Enter Details" />
  ]}
  layout="2*2"
  type="primary"
  variant="form"
  withDivider
  children={[
    <LabelFieldPair key="name">
      <TextBlock style={textBlockStyle} body={"Name"}></TextBlock>
      <TextInput type="text"></TextInput>
    </LabelFieldPair>,
    <LabelFieldPair key="gender">
      <TextBlock style={textBlockStyle} body={"Gender"}></TextBlock>
      <RadioButtons
        options={[
          { code: "M", name: "Male" },
          { code: "F", name: "Female" },
          { code: "O", name: "Others" },
        ]}
        optionsKey="name"
        name="gender"
        selectedOption={selectedGender}
        onSelect={handleGenderSelect}
        style={{
          width: "100%",
          justifyContent: "unset",
          ...(isMobileView ? {} : { gap: "24px" }),
        }}
      />
    </LabelFieldPair>,
    <LabelFieldPair>
      <TextBlock style={textBlockStyle} body={"Mobile Number"}></TextBlock>
      <TextInput
        type="text"
        populators={{
          prefix: "+91",
        }}
      />
    </LabelFieldPair>,
    <LabelFieldPair>
      <TextBlock
        style={textBlockStyle}
        body={"Alternate Mobile number"}
      ></TextBlock>
      <TextInput
        type="text"
        populators={{
          prefix: "+91",
        }}
      />
    </LabelFieldPair>,
    <LabelFieldPair>
      <TextBlock style={textBlockStyle} body={"Guardian"}></TextBlock>
      <TextInput type="text"></TextInput>
    </LabelFieldPair>,
    <LabelFieldPair>
      <TextBlock style={textBlockStyle} body={"Special Category"}></TextBlock>
      <div style={{ width: "100%" }}>
        <Dropdown
          option={[
            { code: "1", name: "Below Poverty Line" },
            { code: "2", name: "Above Poverty Line" },
          ]}
          optionKey={"name"}
          selected={{ code: "1", name: "Below Poverty Line" }}
        ></Dropdown>
      </div>
    </LabelFieldPair>,
    <LabelFieldPair>
      <TextBlock style={textBlockStyle} body={"Document ID"}></TextBlock>
      <TextInput type="text"></TextInput>
    </LabelFieldPair>,
    <LabelFieldPair>
      <TextBlock style={textBlockStyle} body={"Document Type"}></TextBlock>
      <div style={{ width: "100%" }}>
        <Dropdown
          option={[
            { code: "1", name: "BPL Certificate" },
            { code: "2", name: "CertificateTwo" },
          ]}
          optionKey={"name"}
          selected={{ code: "1", name: "BPL Certificate" }}
        ></Dropdown>
      </div>
    </LabelFieldPair>,
    <LabelFieldPair>
      <TextBlock style={textBlockStyle} body={"Email ID"}></TextBlock>
      <TextInput type="text"></TextInput>
    </LabelFieldPair>,
    <LabelFieldPair>
      <TextBlock
        style={textBlockStyle}
        body={"Correspondence Address"}
      ></TextBlock>
      <TextInput type="text"></TextInput>
    </LabelFieldPair>,
    <CheckBox
      key="checkbox"
      label={"Same as Property Address"}
      checked={isSameAsPropertyAddress}
      onChange={handleCheckboxChange}
    ></CheckBox>,
  ]
}
/>




                                                                 Figure 2.3.2.1 : FormCard

For more Information Visit : FormCard





2.3.3 Summary Card
Overview
The SummaryCard component is a structured display card that organizes and presents data in a clear and concise way. It is used to showcase summary information with labels and values and supports multiple sections, dividers, and custom layouts.
Key Features
Displays summary information in a structured format
Supports single-column and two-column layouts
Allows multiple sections within a single card
Option to show sections as separate cards
Supports dividers between fields and sections
Provides a customizable appearance through props
Do: When to Use This Component
Use when you need to display structured summary information
Use for review pages, data overviews, and structured reports
Use when data needs to be categorized into sections
Use when displaying key-value pairs in a readable format
Do Not: When Not to Use This Component
Do not use for editable forms (Use FormCard instead)
Do not use when only a single piece of information needs to be displayed
Do not use for complex tables with filtering and sorting
Props for SummaryCard

Property
Description
className
Additional CSS class for custom styling.
style
Custom inline styles for the card.
type
Defines the card type (e.g., "primary", "secondary").
sections
Array of sections, where each section contains header, subHeader, and fieldPairs.
withDivider
If true, adds dividers between field pairs.
layout
Defines the column layout (1 for single-column, 2 for two-column).
withSectionDivider
If true, adds dividers between sections.
showSectionsAsMultipleCards
If true, each section is shown inside its own card.
asSeperateCards
If true, each section is rendered as a separate card.



How to Use the SummaryCard Component

Example: 


    <SummaryCard
      asSeperateCards
      className=""
      header="Heading"
      layout={1}
      sections={[
        {
          cardType: "primary",
          fieldPairs: [
            {
              inline: true,
              label: "Name",
              type: "text",
              value: "John Doe",
            },
            {
              inline: true,
              label: "Age",
              value: "28",
            },
            {
              inline: true,
              label: "Profile Picture",
              type: "image",
              value: {
                alt: "Profile",
                height: "50px",
                src:
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                width: "50px",
              },
            },
          ],
          header: "Personal Information",
          subHeader: "Basic details",
        },
        {
          cardType: "primary",
          fieldPairs: [
            {
              inline: true,
              label: "Email",
              value: "john.doe@example.com",
            },
            {
              inline: true,
              label: "Phone",
              type: "action",
              value: {
                icon: "Call",
                label: "+1 123-456-7890",
                onClick: () => {},
                size: "medium",
                style: {},
                variation: "link",
              },
            },
          ],
          header: "Contact Information",
          subHeader: "How to reach me",
        },
        {
          cardType: "primary",
          fieldPairs: [
            {
              inline: true,
              label: "Street",
              value: "123 Main St",
            },
            {
              inline: true,
              label: "City",
              value: "Los Angeles",
            },
            {
              inline: true,
              label: "State",
              value: "CA",
            },
            {
              inline: true,
              label: "Zip Code",
              value: "90001",
            },
          ],
          header: "Address",
          subHeader: "Where I live",
        },
        {
          cardType: "primary",
          fieldPairs: [
            {
              inline: true,
              label: "Resume",
              type: "document",
              value: {
                onClick: () => {},
              },
            },
            {
              inline: true,
              label: "Custom",
              renderCustomContent: (value) => value,
              type: "custom",
                value: <Tag label="Tag" stroke type="success"/>
            },
          ],
          header: "Other Details",
        },
      ]}
      style={{}}
      subHeader="Subheading"
      type="primary"
    />








                                                                 Figure 2.3.3.1 : SummaryCard

For more Information Visit : SummaryCard

2.3.4 Filter Card
Overview
The FilterCard component is used to display filter options in a structured format. It can be embedded in a page or shown as a popup overlay. The component supports horizontal and vertical layouts, customizable buttons, and a close option.
Key Features
Displays filter options in a structured format
Supports horizontal and vertical layouts
Can be used as a popup overlay
Supports primary and secondary action buttons
Provides a close button option
Detects overflowing content and adjusts accordingly
Customizable icons, styles, and layout
Do: When to Use This Component
Use when you need to display filter options in a structured manner
Use when filters require user actions such as Apply and Reset
Use when filters should be displayed in a separate popup
Use when you need a consistent UI for filtering sections
Do Not: When Not to Use This Component
Do not use for general content display (Use Card instead)
Do not use when only one or two simple filters are needed
Do not use if no user action is required on the filters
Props for FilterCard

Property
Description
title
The title displayed at the top of the filter card.
titleIcon
An optional icon displayed next to the title.
children
The content inside the filter card.
primaryActionLabel
Label for the primary action button (e.g., "Apply").
secondaryActionLabel
Label for the secondary action button (e.g., "Reset")
onPrimaryPressed
Callback function triggered when the primary button is clicked.
onSecondaryPressed
Callback function triggered when the secondary button is clicked.
layoutType
Defines the layout type (horizontal or vertical). Default is "horizontal".
equalWidthButtons
If true, the buttons will have equal width.
addClose
If true, a close button will be displayed.
onClose
Callback function triggered when the filter card is closed.
className
Additional CSS class for custom styling.
style
Custom inline styles for the card.
hideIcon
If true, the filter icon will be hidden.
isPopup
If true, the filter card appears as a popup overlay.
onOverlayClick
Callback function triggered when the overlay is clicked (for closing the popup).
contentClassName
Additional CSS class for styling the content container.



How to Use the FilterCard Component

Example: 


<FilterCard
  addClose
  equalWidthButtons
  layoutType="vertical"
  onClose={function noRefCheck(){}}
  onPrimaryPressed={function noRefCheck(){}}
  onSecondaryPressed={function noRefCheck(){}}
  primaryActionLabel="ApplyFilters"
  secondaryActionLabel="Clear Filters"
  title="Filter"
>
  <LabelFieldPair vertical>
    <TextBlock body="Name" />
    <TextInput type="text" />
  </LabelFieldPair>
  <LabelFieldPair vertical>
    <TextBlock body="Value" />
    <TextInput type="text" />
  </LabelFieldPair>
  <LabelFieldPair vertical>
    <TextBlock body="Gender" />
    <RadioButtons
      alignVertical
      name="gender"
      onSelect={function noRefCheck(){}}
      options={[
        {
          code: 'M',
          name: 'Male'
        },
        {
          code: 'F',
          name: 'Female'
        },
        {
          code: 'O',
          name: 'Others'
        }
      ]}
      optionsKey="name"
      style={{
        width: '100%'
      }}
    />
  </LabelFieldPair>
</FilterCard>








                                                                 Figure 2.3.4.1 : Vertical FilterCard
                                                              Figure 2.3.4.2 : Horizontal FilterCard



For more Information Visit : FilterCard


2.4 Footer


Overview
The Footer component is a flexible container for displaying action fields (such as buttons or other interactive elements) and optional child content. It adapts to mobile views, ensures responsive design, and offers functionality to sort or align the action fields. This makes it suitable for creating consistent action bars in various UI contexts, such as forms, toolbars, or dashboards.
Key Features
Responsive Design: Automatically adjusts the layout for mobile and desktop views.
Customizable Alignment: Allows aligning action fields to the left or right.
Action Field Sorting: Optionally sorts action fields based on priority (e.g., primary, secondary, tertiary).
Dynamic Field Handling: Supports limiting the number of action fields displayed.
Flexible Content: Allows adding additional children alongside action fields.
Do: When to Use This Component
Use this component to create action bars for toolbars, forms, or navigation areas.
Use it to organize and align buttons or other action fields effectively.
Use it for mobile-friendly designs requiring action bars.
Do Not: When Not to Use This Component
Avoid using it for layouts without interactive fields or actions.
Do not use it for scenarios requiring extensive customization beyond what the component supports.
Props for Footer
Property
Description
className
Custom CSS class for the action bar container.
style
Inline styles for the action bar container.
actionFields
Array of elements (e.g., buttons) to display in the action bar.
maxActionFieldsAllowed
Maximum number of action fields to display. Defaults to 5.
sortActionFields
Boolean to enable sorting of action fields based on their priority (e.g., primary, secondary, tertiary).
setactionFieldsToRight
Boolean to align the action fields to the right.
setactionFieldsToLeft
Boolean to align the action fields to the left.
children
Additional content to display alongside the action fields.



How to Use the Footer Component

<Footer
  actionFields={[
    <Button icon="ArrowBack" label="Back" onClick={()=>{}} type="button" variation="secondary"/>,
    <Button icon="ArrowForward" isSuffix label="Next" onClick={()=>{}} type="button"/>
  ]}
  className=""
  maxActionFieldsAllowed={5}
  sortActionFields
  style={{}}
/>

                         Figure 2.4.1 : Footer


                                         Figure 2.4.2 : Footer With ActionFields Set To Right

                                        Figure 2.4.3 : Footer With ActionFields Set To Left


                                        Figure 2.4.4 : Footer With ActionButton as ActionField

For more Information Visit : Footer

2.5 Hamburger
Overview
The Hamburger component is a collapsible mobile-friendly sidebar menu with support for nested navigation items, profile details, search functionality, user manuals, and logout actions. It is designed to be interactive and accessible for modern web applications.
Key Features
Collapsible Sidebar – Expands and collapses on interaction.
Profile Section – Displays user profile name and contact number.
Nested Menu Support – Allows hierarchical navigation.
Search Functionality – Users can search for menu items.
User Manuals – Provides quick access to help resources.
Logout Action – Includes a logout button for quick session termination.
Click Outside to Close – Optional feature to close the menu when clicking outside.
Do: When to Use This Component
When building a responsive sidebar menu for web applications.
When providing profile information in the navigation.
When needing searchable and hierarchical menu items.
When supporting user guides and help manuals.
When requiring a logout option within the menu.
Do Not: When Not to Use This Component
When a simple top navigation bar is sufficient.
When a fixed sidebar menu (like SideNav) is a better fit.
When menu items do not require hierarchical structure.
When search functionality is not needed.
Props for Hamburger
Property
Description
items
List of menu items with labels, icons, and optional submenus.
profileName
Name of the user displayed in the profile section.
profileNumber
Contact number displayed below the profile name.
theme
Theme of the menu (dark or light).
className
Custom class for additional styling.
styles
Custom styles for the menu.
hideUserManuals
Hides the user manuals section when true.
useManualLabel
Label text for the user manuals section.
profile
URL for the user's profile picture.
usermanuals
List of available user manuals with labels and icons.
onSelect
Callback when a menu item is selected.
onLogout
Callback when the logout button is clicked.
reopenOnLogout
Determines if the menu should reopen after logout.
closeOnClickOutside
Closes the menu when clicking outside.
onOutsideClick
Callback when clicking outside the menu.



How to Use the Hamburger

  <Hamburger
    items={[
      {
        children: [
          {
            icon: '',
            label: 'City 1',
            path: '/'
          },
          {
            icon: '',
            label: 'City 2',
            path: '/'
          }
        ],
        icon: 'Home',
        isSearchable: true,
        label: 'City'
      },
      {
        children: [
          {
            icon: '',
            label: 'Language 1',
            path: '/'
          },
          {
            icon: '',
            label: 'Language 2',
            path: '/'
          }
        ],
        icon: 'DriveFileMove',
        isSearchable: true,
        label: 'Language'
      },
      {
        children: [
          {
            children: [
              {
                icon: '',
                label: 'InnerModule 1',
                path: '/'
              },
              {
                icon: '',
                label: 'InnerModule 2',
                path: '/'
              }
            ],
            icon: '',
            label: 'SubModule 1',
            path: '/'
          },
          {
            icon: '',
            label: 'SubModule 2',
            path: '/'
          }
        ],
        icon: 'Accessibility',
        isSearchable: true,
        label: 'SideNav'
      }
    ]}
    onLogout={()=>{}}
    onOutsideClick={()=>{}}
    onSelect={()=>{}}
    profile=""
    profileName="ProfileName"
    profileNumber="+258 6387387"
    theme="dark"
    transitionDuration={0.3}
    userManualLabel="UserManual"
    usermanuals={[]}
  />



            Figure 2.5.1 : Dark Theme Hamburger

Figure 2.5.1 : Light Theme Hamburger


For more Information Visit : Hamburger

2.6 LandingPageCard


Overview
The LandingPageCard component is a versatile and responsive card component designed for displaying key information, metrics, and links on a landing page or dashboard. It includes customizable icons, metrics, and links, making it suitable for summarizing data or providing quick navigation options. It also supports adding custom content in specific sections of the card.
Key Features
Customizable Header: Display icons and a module name with alignment options.
Metrics Display: Show counts and labels, with click event handling for metrics.
Link Buttons: Add interactive buttons with labels and icons that redirect to specified URLs.
Section Dividers: Optionally display dividers to separate different card sections.
Custom Content: Add additional custom content in the middle or at the end of the card.
Responsiveness: The card layout adapts to different screen sizes.
Dynamic Styling: Customize card appearance using props like style, className, and alignment settings.
Do: When to Use This Component
Use this component to display important metrics, summaries, or statistics on a landing page or dashboard.
Use it to provide quick navigation links to related pages or modules.
Use it to organize and visually enhance content with sections and dividers.
Use it to show a concise overview of module information, including counts, labels, and icons.
Do Not: When Not to Use This Component
Avoid using this component if your content is too detailed or exceeds the card's layout capabilities.
Do not use it if the page does not require actionable metrics or links.
Avoid using the card for scenarios where extensive interactivity or animation is required beyond what is supported.
Props for LandingPageCard
Property
Description
icon
Icon to display in the header.
moduleName
Title or name of the module displayed in the header.
moduleAlignment
Alignment of the module header (left or right).
metrics
Array of metric objects, each with count, label, and link.
metricAlignment
Alignment of the metrics section (left or right).
links
Array of link objects, each with label, link, and icon.
className
Custom CSS class for the card.
style
Inline styles for the card.
hideDivider
Boolean to hide or show dividers between sections.
iconBg
Boolean to add a background to the icon in the header.
buttonSize
Size of the buttons in the links section (small, medium, or large).
onMetricClick
Function triggered when a metric is clicked, receives link and count as arguments.
centreChildren
Custom content to display in the center section of the card.
endChildren
Custom content to display at the end section of the card.



How to Use the LandingPageCard

<LandingPageCard
  buttonSize="medium"
  centreChildren={[
    <div>Here you can add any text content between metrics and links</div>
  ]}
  endChildren={[
    <div>Here you can add any text content below links</div>
  ]}
  icon="SupervisorAccount"
  links={[
    {
      icon: 'Person',
      label: 'Create User',
      link: 'https://unified-dev.digit.org/storybook/?path=/story/atoms-backlink--primary'
    },
    {
      icon: 'Edit',
      label: 'Edit User',
      link: 'https://unified-dev.digit.org/storybook/?path=/story/atoms-backlink--primary'
    },
    {
      icon: 'Preview',
      label: 'View User',
      link: 'https://unified-dev.digit.org/storybook/?path=/story/atoms-backlink--primary'
    },
    {
      icon: 'Delete',
      label: 'Delete User',
      link: 'https://unified-dev.digit.org/storybook/?path=/story/atoms-backlink--primary'
    }
  ]}
  metrics={[
    {
      count: 40,
      label: 'Lorem Ipsum',
      link: 'https://unified-dev.digit.org/storybook/?path=/story/atoms-backlink--primary'
    },
    {
      count: 40,
      label: 'Lorem Ipsum',
      link: 'https://unified-dev.digit.org/storybook/?path=/story/atoms-backlink--primary'
    }
  ]}
  moduleName="Dashboards"
  onMetricClick={function noRefCheck(){}}
  style={{}}
  variation="one"
/>



            Figure 2.6.1 : Landing Page Card with Children


For more Information Visit : LandingPageCard


2.7 MenuCard


Overview
The MenuCard component is a simple and customizable card designed to represent menu items or options. It displays an icon, a title, and an optional description. It is interactive and can trigger actions when clicked. This makes it suitable for navigation menus, feature showcases, or any list of selectable items.
Key Features
Icon Display: Option to display an icon as a visual representation of the menu item.
Menu Name: Displays the name or title of the menu item in a readable format.
Description: Add a brief description to provide more context for the menu item.
Interactive: Can trigger an action when clicked, using the onClick prop.
Customizable Appearance: Use styles and className to modify its look and feel.
Localization Support: Supports translations for menuName and description.
Do: When to Use This Component
Use it to create navigational menus or dashboards.
Use it to showcase features or options in a card layout.
Use it to display a summary of menu items with icons and descriptions.
Use it for simple actions or navigation triggered by user clicks.
Do Not: When Not to Use This Component
Avoid using this component for displaying extensive or complex data.
Do not use it if no interactivity or visual representation is required.
Avoid using this component if the design demands animations or transitions that are not supported by the component.
Props for MenuCard
Property
Description
icon
The icon to display in the card.
menuName
The title or name of the menu item.
description
A short description providing more details about the menu item (optional).
className
Custom CSS classes to apply to the card for styling.
styles
Inline styles to customize the appearance of the card.
onClick
Function triggered when the card is clicked (optional).


How to Use the MenuCard

<MenuCard
  description="Use this checklist to supervise the team formation for Registration & Distribution"
  icon="Article"
  menuName="Menu"
  onClick={()=>{}}
  styles={{}}
/>

Figure 2.7.1 : MenuCard 


For more Information Visit : MenuCard

2.8 MetricCard


Overview
The MetricCard component is a grid-based card layout designed to display metrics with values, descriptions, and optional status indicators. This component supports dynamic layouts with customizable rows and columns, making it ideal for dashboards or analytical displays. It also includes optional dividers for better visual separation between metrics.
Key Features
Dynamic Layout: Specify rows and columns for arranging metrics using the layout prop.
Metric Details: Display metric values, descriptions, and status with optional status messages.
Status Indicators: Show increased or decreased statuses with icons.
Customizable Dividers: Include vertical or bottom dividers for better readability.
Custom Styling: Use styles and className for appearance customization.
Localization Support: Metric descriptions and status messages support translation.
Do: When to Use This Component
Use it to display a grid of metrics in a structured format.
Use it in dashboards or reports to showcase key performance indicators.
Use it when you need to visually differentiate metrics with dividers and status indicators.
Do Not: When Not to Use This Component
Avoid using this component for displaying complex content that doesn’t fit into rows and columns.
Do not use it if you need extensive animations or highly interactive features.
Avoid using it for unrelated or non-metric content.
Props for MetricCard
Property
Description
metrics
An array of objects representing the metrics to display. Each object includes value, description, statusmessage  and status.
withDivider
Adds vertical dividers between metrics in a row.
withBottomDivider
Adds horizontal dividers between rows of metrics.
className
Custom CSS classes to style the card.
styles
Inline styles for additional customization.
layout
Defines the grid layout in the format rows*columns (e.g., "2*3" for 2 rows and 3 columns).


How to Use the MetricCard

<MetricCard
  layout="2*2"
  metrics={[
    {
      description: 'Test Compilance',
      status: 'Decreased',
      statusmessage: '10% than state average',
      value: '3%'
    },
    {
      description: 'Quality Tests Passed',
      status: 'Increased',
      statusmessage: '80% than state average',
      value: '60%'
    },
    {
      description: 'description',
      status: 'Nochange',
      statusmessage: '15% than state average',
      value: '90%'
    },
    {
      description: 'description',
      status: 'Increased',
      statusmessage: '6% than state average',
      value: '26%'
    }
  ]}
  styles={{}}
  withBottomDivider
  withDivider
/>


               Figure 2.8.1 : MetricCard


For more Information Visit : MetricCard

2.9 PanelCard


Overview
The PanelCard component is a versatile card-like container designed to display content with a header, body, and footer. It dynamically handles overflowing content, adapts to mobile views, and offers customizable features like inline child display, shadow effects, and footer buttons. It is ideal for scenarios where structured and responsive content presentation is required.
Key Features
Header Integration: Includes a header using the Panels component for displaying messages, icons, and responses.
Responsive Design: Automatically adjusts layout and footer button order for mobile and desktop views.
Dynamic Footer: Allows customizable footer buttons with sorting and limit options.
Overflow Handling: Detects overflowing content and adds visual indicators like shadows.
Customizable: Supports various styling and layout options for the card, header, body, and footer.
Do: When to Use This Component
Use this component to display content with a clear structure, including headers and footers.
Use it for responsive content that needs to adapt to different device types.
Use it when you need to handle dynamic footer buttons or overflowing content gracefully.
Do Not: When Not to Use This Component
Do not use it for simple content that doesn’t require structured headers or footers.
Avoid using it for scenarios with highly complex interactions that require more advanced layout mechanisms.
Props for PanelCard
Property
Description
className
Custom CSS class for the card container.
style
Inline styles for the card container.
children
The main content to display inside the card body.
footerChildren
Footer elements (e.g., buttons) to be displayed at the bottom of the card.
message
The main message to display in the header.
type
Type of the panel (e.g., success, error) for appropriate styling.
info
Additional information to display in the header.
response
Custom response text or content for the header.
customIcon
A custom icon to display in the header.
iconFill
Custom color for the icon in the header.
multipleResponses
Array of additional responses to display in the header.
footerclassName
Custom CSS class for the footer container.
footerStyles
Inline styles for the footer container.
cardClassName
Custom CSS class for the card's outermost wrapper.
cardStyles
Inline styles for the card's outermost wrapper.
maxFooterButtonsAllowed
Maximum number of footer buttons to display.
sortFooterButtons
Boolean to enable or disable sorting of footer buttons based on priority.
showChildrenInline
Boolean to display child elements inline instead of the default stacked layout.
description
Description to be shown before the panel card children



How to Use the PanelCard Component

<PanelCard
  animationProps={{
    loop: false,
    noAutoplay: false
  }}
  cardClassName=""
  cardStyles={{}}
  className=""
  customIcon=""
  description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
  footerChildren={[
    <Button label="Button" onClick={()=>{}} type="button" variation="secondary"/>,
    <Button label="Button" onClick={()=>{}}  type="button"/>
  ]}
  footerStyles={{}}
  iconFill=""
  info="Ref ID "
  maxFooterButtonsAllowed={5}
  message="Success Message!"
  multipleResponses={[]}
  props={{}}
  response="949749795479"
  sortFooterButtons
  style={{}}
  type="success"
>
  <AlertCard
    className="panelcard-alert-card"
    text="This is success"
    variant="success"
  />
</PanelCard>

Figure 2.9.1 : PanelCard with type success



Figure 2.9.2 : PanelCard with type error


For more Information Visit : PanelCard

2.10 PopUp

Overview
The PopUp component is a versatile and customizable modal dialog used to display content in an overlay on top of the current page. It's designed to capture user attention for important messages, confirmations, alerts, or forms. The component supports various types like default popups and alert popups, includes options for custom icons or animations, and handles responsive design for mobile views.
Key Features
Customizable Content: Supports custom headers, footers, and main content areas.
Alert Mode: Special "alert" type with specific styling and behaviors.
Custom Icons and Animations: Ability to use custom icons or animations in the header.
Responsive Design: Adjusts layout for mobile devices.
Overflow Handling: Manages content overflow with scrollable areas and shadow indicators.
Keyboard Accessibility: Supports keyboard navigation with Escape to close and Enter to submit.
Close Animations: Smooth closing animations when the popup is dismissed.
Footer Button Sorting: Option to sort footer buttons by priority.
Do: When to Use This Component
Use when you need to display important information that requires user interaction or acknowledgment.
Ideal for confirmation dialogs, alerts, forms, or any modal content.
When you want to prevent user interaction with the underlying content until an action is taken.
If you need a popup that is accessible and responsive across different devices.
Do Not: When Not to Use This Component
Avoid using for content that doesn't require immediate user attention.
Do not overuse popups as they can interrupt user experience if used excessively.
Props for PopUp
Property
Description
className
Custom CSS class for the popup wrapper.
style
Inline styles for the popup wrapper.
children
Main content to be displayed inside the popup.
headerclassName
Custom CSS class for the header section.
footerclassName
Custom CSS class for the footer section.
footerStyles
Inline styles for the footer buttons container.
footerChildren
An array of React elements (e.g., buttons) to display in the footer.
maxFooterButtonsAllowed
Maximum number of footer buttons to display (default is 5).
sortFooterButtons
Boolean to enable sorting of footer buttons by priority (primary, secondary, tertiary).
equalWidthButtons
Boolean to make footer buttons have equal width.
onClose
Function to call when the popup is closed.
onOverlayClick
Function to call when the overlay (background) is clicked.
type
Type of the popup, can be "alert" or default.
showIcon
Boolean to display an icon in the header (default is false).
customIcon
Custom icon name to display in the header.
iconFill
Color to fill the custom icon.
heading
The main heading text for the popup.
subheading
The subheading text for the popup.
headerMaxLength
Maximum length for the heading text (default is 256).
subHeaderMaxLength
Maximum length for the subheading text (default is 256).
description
Additional description text to display in the content area.
showChildrenInline
Boolean to display children content inline.
overlayClassName
Custom CSS class for the overlay (background behind the popup).
alertHeading
Heading text for alert type popup (default is "Alert!").
alertMessage
Message text for alert type popup (default is "AlertMessage").
showAlertAsSvg
Boolean to show alert icon as SVG instead of animation in alert type popup.
showIcon
Boolean to show an icon in the default type popup header.


How to Use the PopUp Component

<PopUp
  alertHeading=""
  alertMessage=""
  className=""
  customIcon=""
  description="Please contact the administrator if you have forgotten your password."
  equalWidthButtons
  footerChildren={[
    <Button label="Cancel" onClick={() => {}} type="button"/>,
    <Button icon="FileDownload" label="Download Template" onClick={function noRefCheck() {}} type="submit"/>
  ]}
  footerStyles={{}}
  footerclassName=""
  headerMaxLength=""
  headerclassName=""
  heading="Heading"
  iconFill=""
  maxFooterButtonsAllowed={5}
  onClose={function noRefCheck() {}}
  onOverlayClick={function noRefCheck() {}}
  overlayClassName=""
  props={{}}
  showIcon
  sortFooterButtons
  style={{}}
  subHeaderMaxLength=""
  subheading="Subheading"
  type="default"
>
  <div>
    This is the content of the Popup
  </div>
  <AlertCard
    className="popup-alert-card"
    text="This is an alert card"
  />
</PopUp>




<PopUp
  alertHeading="Alert!"
  alertMessage="Please contact the administrator if you have forgotten your password."
  className=""
  customIcon=""
  description=""
  equalWidthButtons
  footerChildren={[
    <Button label="Button" onClick={() => {}} type="button" variation="secondary"/>,
    <Button label="Button" onClick={function noRefCheck() {}} type="button"/>
  ]}
  footerStyles={{}}
  footerclassName=""
  headerMaxLength=""
  headerclassName=""
  heading=""
  iconFill=""
  maxFooterButtonsAllowed={5}
  onClose={function noRefCheck() {}}
  onOverlayClick={function noRefCheck() {}}
  overlayClassName=""
  props={{}}
  showIcon
  sortFooterButtons
  style={{}}
  subHeaderMaxLength=""
  subheading=""
  type="alert"
>
  <div>
    This is the content of the Popup
  </div>
  <AlertCard
    className="popup-alert-card"
    text="This is an alert card"
  />
</PopUp>



                                                                     Figure 2.10.1 : PopUp

					Figure 2.10.2 : Alert PopUp


For more Information Visit : PopUp

2.11 ResultsDataTable

Overview
The ResultsDataTable component is built using the react-data-table-component library (version : 7.6.2), a highly customizable and performant table library for React applications.
The ResultsDataTable component is a feature-rich table for displaying structured data with support for sorting, filtering, selection, pagination, and expandable rows. It integrates seamlessly with React Data Table and offers customizable styling.
Key Features
Customizable Columns & Data – Supports dynamic columns and flexible row data.
Row Selection – Allows checkbox selection of rows with callback functions.
Expandable Rows – Rows can expand to show additional data.
Global Search – Enables searching through table records.
Pagination & Sorting – Includes server-side pagination and custom sorting.
Conditional Styling – Supports row styling based on conditions.
Loading State – Displays a Loader when data is being fetched.
Action Buttons – Supports custom actions for selected rows.
Do: When to Use This Component
When you need an interactive, structured table with advanced functionalities.
When implementing server-side pagination and data fetching.
When requiring row selection for bulk actions.
When displaying nested or expandable row content.
Do Not: When Not to Use This Component
If performance is a concern with huge datasets (consider virtualization).
If you need a simple, static table without interactions.

Props for ResultsDataTable
Property
Description
data
The array of row data for the table.
columns
Defines the table column headers and configurations.
showCheckBox
Enables row selection checkboxes.
selectProps
Additional props for the checkbox selection.
onSelectedRowsChange
Callback when selected rows change.
onRowClicked
Callback when a row is clicked.
selectableRowsNoSelectAll
Disables "Select All" functionality.
expandableRows
Enables expandable row support.
expandableRowsComponent
Component to render in expanded rows.
progressPending
Shows a loader when data is loading.
progressComponent
Custom loading component.
conditionalRowStyles
Custom styles based on row data conditions.
paginationRowsPerPageOptions
Defines available rows per page.
onChangePage
Callback when the page changes.
paginationPerPage
Number of rows per page.
paginationDefaultPage
Default starting page.
onChangeRowsPerPage
Callback when rows per page changes.
paginationTotalRows
Total number of rows for server-side pagination.
isPaginationRequired
Enables or disables pagination.
defaultSortAsc
Controls the default sort order.
tableClassName
Custom class for the table.
onRowExpandToggled
Callback when an expandable row is toggled.
showTableDescription
Displays a description above the table.
showTableTitle
Displays a title above the table.
enableGlobalSearch
Enables search functionality.
showSelectedState
Displays selected row count if true
selectedRows
Array of currently selected rows.
actions
Array of action buttons for selected rows.
searchHeader
Placeholder text for the search box.
onSearch
Callback function when search is performed.
handleActionSelect
Handles actions on selected rows.
showSelectedStatePosition
Position of the selected row count display ("top of table”  or "bottom of table”).
rowsPerPageText
Custom label for rows per page.
paginationComponentOptions
Options for customizing pagination.




			          Figure 2.11.1 : ResultsDataTable


2.12 SideNav

Overview
The SideNav component is a collapsible and expandable sidebar navigation menu. It supports nested items, icons, search functionality, and accessibility tools. It can be used to create a dynamic navigation menu with customizable styles, themes, and interaction behaviors.
Key Features
Collapsible & Expandable – Automatically expands when hovered.
Supports Nested Items – Submenus for better organization.
Search Functionality – Filter menu items dynamically.
Customizable Appearance – Supports light/dark themes & styling options.
Icons & Labels – Each menu item can have an icon & label.
Footer Actions – Includes help, settings, and logout options.
Do: When to Use This Component
When creating a sidebar navigation menu for web applications.
When a collapsible navigation menu is required.
When supporting nested menu structures.
When allowing searchable navigation items.
Do Not: When Not to Use This Component
When navigation is simple and does not require collapsibility.
When a top navigation bar is more appropriate.
When menu items do not require icons or hierarchy.
Props for SideNav
Property
Description
items
List of menu items with icons, labels, and optional submenus.
theme
Theme of the sidebar (dark or light).
variant
Style variant (primary, secondary).
collapsedWidth
Width of the sidebar when collapsed.
expandedWidth
Width of the sidebar when expanded.
transitionDuration
Time (in seconds) for expand/collapse animation.
styles
Custom styles for the sidebar.
hideAccessbilityTools
Hides accessibility tools in the sidebar footer.
enableSearch
Enables search functionality in the sidebar.
onSelect
Callback function when a menu item is clicked.
onBottomItemClick
Callback function for footer actions (Help, Settings, Logout).
className
Custom class name for “digit-sidebar” class


How to Use the SideNav Component

  <SideNav
    items={[
      {
        icon: {
          icon: 'Home'
        },
        label: 'Home'
      },
      {
        children: [
          {
            icon: {
              icon: 'Work'
            },
            label: 'SubModule 1',
            path: '/'
          },
          {
            icon: {
              icon: 'Person'
            },
            label: 'SubModule 2',
            path: '/'
          }
        ],
        icon: {
          icon: 'ChatBubble'
        },
        label: 'Module 1'
      },
      {
        children: [
          {
            children: [
              {
                icon: {
                  icon: 'LabelImportant'
                },
                label: 'InnerModule 1',
                path: '/'
              },
              {
                icon: {
                  icon: 'Lock'
                },
                label: 'InnerModule 2',
                path: '/'
              }
            ],
            icon: {
              icon: 'Info'
            },
            label: 'SubModule 1',
            path: '/'
          },
          {
            icon: {
              icon: 'Accessibility'
            },
            label: 'SubModule 2',
            path: '/'
          }
        ],
        icon: {
          icon: 'CheckCircle'
        },
        label: 'Module 2'
      },
      {
        icon: {
          icon: 'Delete'
        },
        label: 'Module 3'
      },
      {
        icon: {
          icon: 'DriveFileMove'
        },
        label: 'Module 4'
      },
      {
        icon: {
          icon: 'Label'
        },
        label: 'Module 5'
      },
      {
        icon: {
          icon: 'Lightbulb'
        },
        label: 'Module 6'
      }
    ]}
    onBottomItemClick={function noRefCheck(){}}
    onSelect={function noRefCheck(){}}
    transitionDuration={0.5}
  />


                                                 Figure 2.12.1 : Dark theme SideNav
			          Figure 2.12.2 : Light theme SideNav


For more Information Visit : SideNav

2.13 SidePanel

Overview
The SidePanel is a versatile, customizable sliding menu component. It can be used to display additional content like navigation menus, settings, or dynamic sections that slide in and out from the left or right of the screen. With options for both static and dynamic sliding behavior, the component offers a draggable interface and supports a variety of customization features.
Key Features
Static and Dynamic Modes: Operates in a fixed or interactive sliding state.
Draggable Option: Adjust the width dynamically by dragging the edge of the menu.
Customizable Headers and Footers: Different layouts for open and closed states.
Smooth Transitions: Adjustable transition duration for seamless animations.
Sections and Dividers: Organize content into sections with optional dividers.
Overlay Support: Optionally display an overlay to emphasize the menu.
Compact Closed State: Display minimal content or icons when the menu is closed.
Do: When to Use This Component
Use for slide-in menus, navigation bars, or side panels.
Ideal for dashboards, settings menus, or any content requiring compact display when not in use.
When you need a responsive, draggable interface for dynamic layouts.
Do Not: When Not to Use This Component
Avoid using it for primary navigation on devices with limited screen space.
Do not use for non-interactive elements that don’t require sliding or dynamic behavior.
Not suitable for content-heavy displays that require full-screen visibility.
Props for SidePanel
Property
Description
className
Additional class names for custom styling.
styles
Inline styles for the container.
type
Menu type: "static" (fixed) or "dynamic" (sliding).
position
Slide-in position: "left" or "right".
children
Content to display inside the menu body.
header
Header content for the open state.
footer
Footer content for the open state.
addClose
If true, displays a close button in the header.
closedContents
Content to display in the closed state.
closedSections
Sections to display in the closed state.
closedHeader
Header content for the closed state.
closedFooter
Footer content for the closed state.
transitionDuration
Duration of the sliding animation (in seconds).
bgActive
If true, enables an active background.
isOverlay
If true, displays an overlay when the menu is open.
isDraggable
Enables draggable resizing for the dynamic menu.
sections
An array of sections to display in the open state.
hideArrow
If true, hides the arrow used for toggling the menu.
hideScrollIcon
If true, hides the scroll icon on the edge of the menu.
defaultOpenWidth
Default width of the menu when open.
defaultClosedWidth
Default width of the menu when closed.


How to Use the SidePanel Component

<SidePanel type="dynamic" position="right" defaultOpenWidth={300} defaultClosedWidth={64} header={<h3>Menu Header</h3>} footer={<p>Footer Content</p>} sections={[<p>Section 1</p>, <p>Section 2</p>]} closedContents={<p>Compact View</p>} isDraggable={true} > <p>Main Content Here</p> </SidePanel>


                                                 Figure 2.13.1 : Dynamic Right SidePanel

For more Information Visit : SidePanel


2.14 TableMolecule

Overview
The TableMolecule component is a highly flexible and feature-rich table component that supports:
Sorting
Custom headers with description
Pagination
Row Selections and actions
Custom Styles for borders, dividers 
Nested Tables
Sticky Headers & Footers
It is designed to handle both simple and complex table structures with ease.
Key Features
Customizable Headers & Rows: Fully customizable table headers and rows.
Sorting: Supports ascending, descending, and custom sorting functions.
Pagination: Supports manual and automatic pagination with configurable rows per page.
Row Selection: Allows multiple row selection using checkboxes.
Selection States: Allows to show row selection states and actions based on the selections
Nested Rows: Supports expandable nested rows for hierarchical data.
Sticky Headers & Footers: Keeps headers and footers fixed for better usability.
Customizable Styling: Allows border, dividers, background alternation, and extra styles.
Action Buttons: Provides action buttons for selected rows.
Filters: Supports filtering data within the table.
Frozen Columns: Supports column freezing while scrolling
Do: When to Use This Component
You need a feature-rich table with sorting, pagination, and filtering.
You require a nested table structure for hierarchical data.
You need a customizable table with checkbox selection and sticky headers.
You want action buttons for selected rows.
Do Not: When Not to Use This Component
You need a very simple table with just a few rows (consider using a basic HTML <table>).
You require real-time updates with high-frequency data changes (consider virtualization for performance).

Props for TableMolecule

Property
Inner Props for object props
Description
headerData


Array of objects defining table headers.
rows


Array of table row data.
pagination (object)
initialRowsPerPage
rowsPerPageOptions
manualPagination
onPageSizeChange
onNextPage
onPrevPage
currentPage
totalCount
Configures pagination settings
styles (object)
withBorder
withAlternateBg
withHeaderDivider
withColumnDivider
withRowDivider
extraStyles
Defines table styling options
tableDetails (object)
tableTitle
tableDescription
Configures table title and description.
sorting (object)
isTableSortable
initialSortOrder
customSortFunction
Enables table sorting, including a custom sorting function.
selection (object)
addCheckbox
checkboxLabel
initialSelectedRows
onSelectedRowsChange
showSelectedState
Handles row selection, checkbox labels, and selected state.
footerProps (object)
scrollableStickyFooterContent
footerContent
hideFooter
stickyFooterContent
isStickyFooter
addStickyFooter
Configures sticky footers, footer content, and visibility.
className


Custom class for styling the table.
wrapperClassName


Custom class for styling the table wrapper.
onFilter


Function triggered when applying a filter.
addFilter


Boolean to enable/disable filter options.
onRowClick


Function triggered when a row is clicked.
frozenColumns


Number of columns to freeze in place.
isStickyHeader


Enables sticky headers for the table
actionButtonLabel


Label for the action button.
actions


Array of action buttons for selected rows.


Columns Supported in TableMolecule


The TableMolecule component uses the TableCell component to support various column types. These column types define the content and behavior of each cell inside the table.
Below are the different column types that TableMolecule supports and their functionalities:

Column Type
Description
serialno
Displays a serial number for rows
numeric
Used for displaying numbers and supports sorting.
text
Shows text-based content with optional truncation.
description
Similar to text but supports longer content (up to 256 characters).
tag
Displays a tag-style label with different colors, icons, and click handlers.
switch
Adds an interactive switch (toggle button) inside the table.
checkbox
Shows a checkbox for row selection or user input.
button
Renders a button inside the cell with custom actions.
textinput
Allows inline text input editing inside the table.
dropdown
Displays a single-select dropdown inside the table.
multiselectdropdown
Allows multiple selections inside a dropdown within a table cell.
custom
Enables a custom UI component inside the cell.


Column Type Examples

const headerData = [
  { label: "S.No", type: "serialno" },
  { label: "Text", type: "text"},
  { label: "Numeric", type: "numeric" },
  { label: "Description", type: "description" },
  { label: "Tag", type: "tag" },
  { label: "Switch", type: "switch" },
  { label: "Button", type: "button" },
  { label: "Checkbox", type: "checkbox" },
  { label: "TextInput", type: "textinput" },
  { label: "Dropdown", type: "dropdown" },
  { label: "Multiselectdropdown", type: "multiselectdropdown" },
  { label: "Custom", type: "custom" },
];


const rows = [
  [
    1, // column type : serialno
    {
      label:
        "ALorem ipsum dolor sit amet, consectetuer adipiscing elit. Aeneanp",
      maxLength: 64,
    }, // column type : text
    10000, // column type : numeric
    {
      label:
        "ALorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quisppp",
      maxLength: 256,
    }, // column type : description
    {
      icon: "",
      label: "Tag1",
      labelStyle: {},
      showIcon: false,
      style: {},
      type: "success",
      className: "",
      stroke: true,
      onClick: () => {},
      alignment: "",
      iconClassName: "",
      iconColor: "",
    }, // column type : tag
    {
      isLabelFirst: false,
      label: "Switch1",
      labelStyle: {},
      shapeOnOff: true,
      style: {},
      disable: false,
      className: "",
      isCheckedInitially: false,
      onToggle: () => {},
    }, // column type : switch
    {
      variation: "primary",
      type: "button",
      isDisabled: false,
      showBottom: true,
      icon: "",
      size: "medium",
      label: "Button1",
      onClick: () => {},
      style: {},
      isSuffix: false,
      textStyles: {},
      hideDefaultActionIcon: false,
      options: [],
      isSearchable: true,
      optionsKey: "name",
      onSelect: () => {},
      menuStyles: {},
    }, // column type : button
    {
      onChange: () => {},
      label: "Checkbox1",
      disabled: false,
      checked: false,
      style: {},
      isLabelFirst: false,
      hideLabel: false,
      mainClassName: "table-checkbox",
      props: {},
    }, // column type : checkbox
    {
      type: "text",
    }, // column type :textinput
    {
      optionKey: "name",
      option: options,
      select: (option) => {
        console.log(option, "selected");
      },
    }, // column type :dropdown
    {
      optionsKey: "name",
      options: options,
      onSelect: (option) => {
        console.log(option, "selected");
      },
    }, // column type : multiselectdropdown
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        justifyContent: "flex-start",
      }}
    >
      <Button
        label={"link1"}
        variation={"link"}
        size={"medium"}
        style={{ padding: "0px", justifyContent: "flex-start" }}
      />
      <div className="typography body-s">{"Description"}</div>
    </div>, // column type : custom
  ],
];



How to Use the TableMolecule Component

Example: 



<TableMolecule
  footerProps={{
    addStickyFooter: false,
    footerContent: 'Footer Content',
    hideFooter: false,
    isStickyFooter: false,
    scrollableStickyFooterContent: true,
    stickyFooterContent: 'Sticky Footer Content'
  }}
  frozenColumns={0}
  headerData={[
    {
      label: 'S.No',
      type: 'serialno'
    },
    {
      label: 'Text',
      type: 'text'
    },
    {
      label: 'Numeric',
      type: 'numeric'
    },
    {
      label: 'Description',
      type: 'description'
    },
    {
      label: 'Tag',
      type: 'tag'
    },
    {
      label: 'Switch',
      type: 'switch'
    },
    {
      label: 'Button',
      type: 'button'
    },
    {
      label: 'Checkbox',
      type: 'checkbox'
    },
    {
      label: 'TextInput',
      type: 'textinput'
    },
    {
      label: 'Dropdown',
      type: 'dropdown'
    },
    {
      label: 'Multiselectdropdown',
      type: 'multiselectdropdown'
    },
    {
      label: 'Custom',
      type: 'custom'
    }
  ]}
  pagination={{
    initialRowsPerPage: 2,
    rowsPerPageOptions: [
      2,
      4,
      6,
      8,
      10
    ]
  }}
  rows={[
    [
      1,
      {
        label: 'ALorem ipsum dolor sit amet, consectetuer adipiscing elit. Aeneanp',
        maxLength: 64
      },
      10000,
      {
        label: 'ALorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quisppp',
        maxLength: 256
      },
      {
        alignment: '',
        className: '',
        icon: '',
        iconClassName: '',
        iconColor: '',
        label: 'Tag1',
        labelStyle: {},
        onClick: function noRefCheck(){},
        showIcon: false,
        stroke: true,
        style: {},
        type: 'success'
      },
      {
        className: '',
        disable: false,
        isCheckedInitially: false,
        isLabelFirst: false,
        label: 'Switch1',
        labelStyle: {},
        onToggle: function noRefCheck(){},
        shapeOnOff: true,
        style: {}
      },
      {
        hideDefaultActionIcon: false,
        icon: '',
        isDisabled: false,
        isSearchable: true,
        isSuffix: false,
        label: 'Button1',
        menuStyles: {},
        onClick: function noRefCheck(){},
        onSelect: function noRefCheck(){},
        options: [],
        optionsKey: 'name',
        showBottom: true,
        size: 'medium',
        style: {},
        textStyles: {},
        type: 'button',
        variation: 'primary'
      },
      {
        checked: false,
        disabled: false,
        hideLabel: false,
        isLabelFirst: false,
        label: 'Checkbox1',
        mainClassName: 'table-checkbox',
        onChange: function noRefCheck(){},
        props: {},
        style: {}
      },
      {
        type: 'text'
      },
      {
        option: [
          {
            code: 'English1',
            name: 'English'
          },
          {
            code: 'Hindi2',
            name: 'Hindi'
          }
        ],
        optionKey: 'name',
        select: function noRefCheck(){}
      },
      {
        onSelect: function noRefCheck(){},
        options: '[Circular]',
        optionsKey: 'name'
      },
      <div style={{display: 'flex', flexDirection: 'column', gap: '4px', justifyContent: 'flex-start'}}><Button label="link1" size="medium" style={{justifyContent: 'flex-start', padding: '0px'}} variation="link"/><div className="typography body-s">Description</div></div>
    ],
    [
      2,
      {
        label: 'BLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aeneanp',
        maxLength: 64
      },
      20000,
      {
        label: 'BLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quisppp',
        maxLength: 256
      },
      {
        alignment: '',
        className: '',
        icon: '',
        iconClassName: '',
        iconColor: '',
        label: 'Tag2',
        labelStyle: {},
        onClick: function noRefCheck(){},
        showIcon: false,
        stroke: true,
        style: {},
        type: 'monochrome'
      },
      {
        className: '',
        disable: false,
        isCheckedInitially: false,
        isLabelFirst: false,
        label: 'Switch2',
        labelStyle: {},
        onToggle: function noRefCheck(){},
        shapeOnOff: true,
        style: {}
      },
      {
        hideDefaultActionIcon: false,
        icon: '',
        isDisabled: false,
        isSearchable: true,
        isSuffix: false,
        label: 'Button2',
        menuStyles: {},
        onClick: function noRefCheck(){},
        onSelect: function noRefCheck(){},
        options: [],
        optionsKey: 'name',
        showBottom: true,
        size: 'medium',
        style: {},
        textStyles: {},
        type: 'button',
        variation: 'primary'
      },
      {
        checked: false,
        disabled: false,
        hideLabel: false,
        isLabelFirst: false,
        label: 'Checkbox2',
        mainClassName: 'table-checkbox',
        onChange: function noRefCheck(){},
        props: {},
        style: {}
      },
      {
        type: 'text'
      },
      {
        option: '[Circular]',
        optionKey: 'name',
        select: function noRefCheck(){}
      },
      {
        onSelect: function noRefCheck(){},
        options: '[Circular]',
        optionsKey: 'name'
      },
      <div style={{display: 'flex', flexDirection: 'column', gap: '4px', justifyContent: 'flex-start'}}><Button label="link2" size="medium" style={{justifyContent: 'flex-start', padding: '0px'}} variation="link"/><div className="typography body-s">Description</div></div>
    ],
    [
      3,
      {
        label: 'CLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aeneanp',
        maxLength: 64
      },
      30000,
      {
        label: 'CLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quisppp',
        maxLength: 256
      },
      {
        alignment: '',
        className: '',
        icon: '',
        iconClassName: '',
        iconColor: '',
        label: 'Tag3',
        labelStyle: {},
        onClick: function noRefCheck(){},
        showIcon: false,
        stroke: true,
        style: {},
        type: 'error'
      },
      {
        className: '',
        disable: false,
        isCheckedInitially: false,
        isLabelFirst: false,
        label: 'Switch3',
        labelStyle: {},
        onToggle: function noRefCheck(){},
        shapeOnOff: true,
        style: {}
      },
      {
        hideDefaultActionIcon: false,
        icon: '',
        isDisabled: false,
        isSearchable: true,
        isSuffix: false,
        label: 'Button3',
        menuStyles: {},
        onClick: function noRefCheck(){},
        onSelect: function noRefCheck(){},
        options: [],
        optionsKey: 'name',
        showBottom: true,
        size: 'medium',
        style: {},
        textStyles: {},
        type: 'button',
        variation: 'primary'
      },
      {
        checked: false,
        disabled: false,
        hideLabel: false,
        isLabelFirst: false,
        label: 'Checkbox3',
        mainClassName: 'table-checkbox',
        onChange: function noRefCheck(){},
        props: {},
        style: {}
      },
      {
        type: 'text'
      },
      {
        option: '[Circular]',
        optionKey: 'name',
        select: function noRefCheck(){}
      },
      {
        onSelect: function noRefCheck(){},
        options: '[Circular]',
        optionsKey: 'name'
      },
      <div style={{display: 'flex', flexDirection: 'column', gap: '4px', justifyContent: 'flex-start'}}><Button label="link3" size="medium" style={{justifyContent: 'flex-start', padding: '0px'}} variation="link"/><div className="typography body-s">Description</div></div>
    ],
    [
      4,
      {
        label: 'DLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aeneanp',
        maxLength: 64
      },
      40000,
      {
        label: 'DLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quisppp',
        maxLength: 256
      },
      {
        alignment: '',
        className: '',
        icon: '',
        iconClassName: '',
        iconColor: '',
        label: 'Tag4',
        labelStyle: {},
        onClick: function noRefCheck(){},
        showIcon: false,
        stroke: true,
        style: {},
        type: 'warning'
      },
      {
        className: '',
        disable: false,
        isCheckedInitially: false,
        isLabelFirst: false,
        label: 'Switch4',
        labelStyle: {},
        onToggle: function noRefCheck(){},
        shapeOnOff: true,
        style: {}
      },
      {
        hideDefaultActionIcon: false,
        icon: '',
        isDisabled: false,
        isSearchable: true,
        isSuffix: false,
        label: 'Button4',
        menuStyles: {},
        onClick: function noRefCheck(){},
        onSelect: function noRefCheck(){},
        options: [],
        optionsKey: 'name',
        showBottom: true,
        size: 'medium',
        style: {},
        textStyles: {},
        type: 'button',
        variation: 'primary'
      },
      {
        checked: false,
        disabled: false,
        hideLabel: false,
        isLabelFirst: false,
        label: 'Checkbox4',
        mainClassName: 'table-checkbox',
        onChange: function noRefCheck(){},
        props: {},
        style: {}
      },
      {
        type: 'text'
      },
      {
        option: '[Circular]',
        optionKey: 'name',
        select: function noRefCheck(){}
      },
      {
        onSelect: function noRefCheck(){},
        options: '[Circular]',
        optionsKey: 'name'
      },
      <div style={{display: 'flex', flexDirection: 'column', gap: '4px', justifyContent: 'flex-start'}}><Button label="link4" size="medium" style={{justifyContent: 'flex-start', padding: '0px'}} variation="link"/><div className="typography body-s">Description</div></div>
    ],
    [
      5,
      {
        label: 'ELorem ipsum dolor sit amet, consectetuer adipiscing elit. Aeneanp',
        maxLength: 64
      },
      50000,
      {
        label: 'ELorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quisppp',
        maxLength: 256
      },
      {
        alignment: '',
        className: '',
        icon: '',
        iconClassName: '',
        iconColor: '',
        label: 'Tag5',
        labelStyle: {},
        onClick: function noRefCheck(){},
        showIcon: false,
        stroke: true,
        style: {},
        type: 'monochrome'
      },
      {
        className: '',
        disable: false,
        isCheckedInitially: false,
        isLabelFirst: false,
        label: 'Switch5',
        labelStyle: {},
        onToggle: function noRefCheck(){},
        shapeOnOff: true,
        style: {}
      },
      {
        hideDefaultActionIcon: false,
        icon: '',
        isDisabled: false,
        isSearchable: true,
        isSuffix: false,
        label: 'Button5',
        menuStyles: {},
        onClick: function noRefCheck(){},
        onSelect: function noRefCheck(){},
        options: [],
        optionsKey: 'name',
        showBottom: true,
        size: 'medium',
        style: {},
        textStyles: {},
        type: 'button',
        variation: 'primary'
      },
      {
        checked: false,
        disabled: false,
        hideLabel: false,
        isLabelFirst: false,
        label: 'Checkbox5',
        mainClassName: 'table-checkbox',
        onChange: function noRefCheck(){},
        props: {},
        style: {}
      },
      {
        type: 'text'
      },
      {
        option: '[Circular]',
        optionKey: 'name',
        select: function noRefCheck(){}
      },
      {
        onSelect: function noRefCheck(){},
        options: '[Circular]',
        optionsKey: 'name'
      },
      <div style={{display: 'flex', flexDirection: 'column', gap: '4px', justifyContent: 'flex-start'}}><Button label="link5" size="medium" style={{justifyContent: 'flex-start', padding: '0px'}} variation="link"/><div className="typography body-s">Description</div></div>
    ],
    [
      6,
      {
        label: 'FLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aeneanp',
        maxLength: 64
      },
      60000,
      {
        label: 'FLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quisppp',
        maxLength: 256
      },
      {
        alignment: '',
        className: '',
        icon: '',
        iconClassName: '',
        iconColor: '',
        label: 'Tag6',
        labelStyle: {},
        onClick: function noRefCheck(){},
        showIcon: false,
        stroke: true,
        style: {},
        type: 'success'
      },
      {
        className: '',
        disable: false,
        isCheckedInitially: false,
        isLabelFirst: false,
        label: 'Switch6',
        labelStyle: {},
        onToggle: function noRefCheck(){},
        shapeOnOff: true,
        style: {}
      },
      {
        hideDefaultActionIcon: false,
        icon: '',
        isDisabled: false,
        isSearchable: true,
        isSuffix: false,
        label: 'Button6',
        menuStyles: {},
        onClick: function noRefCheck(){},
        onSelect: function noRefCheck(){},
        options: [],
        optionsKey: 'name',
        showBottom: true,
        size: 'medium',
        style: {},
        textStyles: {},
        type: 'button',
        variation: 'primary'
      },
      {
        checked: false,
        disabled: false,
        hideLabel: false,
        isLabelFirst: false,
        label: 'Checkbox',
        mainClassName: 'table-checkbox',
        onChange: function noRefCheck(){},
        props: {},
        style: {}
      },
      {
        type: 'text'
      },
      {
        option: '[Circular]',
        optionKey: 'name',
        select: function noRefCheck(){}
      },
      {
        onSelect: function noRefCheck(){},
        options: '[Circular]',
        optionsKey: 'name'
      },
      <div style={{display: 'flex', flexDirection: 'column', gap: '4px', justifyContent: 'flex-start'}}><Button label="link6" size="medium" style={{justifyContent: 'flex-start', padding: '0px'}} variation="link"/><div className="typography body-s">Description</div></div>
    ],
    [
      7,
      {
        label: 'GLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aeneanp',
        maxLength: 64
      },
      70000,
      {
        label: 'GLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quisppp',
        maxLength: 256
      },
      {
        alignment: '',
        className: '',
        icon: '',
        iconClassName: '',
        iconColor: '',
        label: 'Tag7',
        labelStyle: {},
        onClick: function noRefCheck(){},
        showIcon: false,
        stroke: true,
        style: {},
        type: 'success'
      },
      {
        className: '',
        disable: false,
        isCheckedInitially: false,
        isLabelFirst: false,
        label: 'Switch7',
        labelStyle: {},
        onToggle: function noRefCheck(){},
        shapeOnOff: true,
        style: {}
      },
      {
        hideDefaultActionIcon: false,
        icon: '',
        isDisabled: false,
        isSearchable: true,
        isSuffix: false,
        label: 'Button7',
        menuStyles: {},
        onClick: function noRefCheck(){},
        onSelect: function noRefCheck(){},
        options: [],
        optionsKey: 'name',
        showBottom: true,
        size: 'medium',
        style: {},
        textStyles: {},
        type: 'button',
        variation: 'primary'
      },
      {
        checked: false,
        disabled: false,
        hideLabel: false,
        isLabelFirst: false,
        label: 'Checkbox7',
        mainClassName: 'table-checkbox',
        onChange: function noRefCheck(){},
        props: {},
        style: {}
      },
      {
        type: 'text'
      },
      {
        option: '[Circular]',
        optionKey: 'name',
        select: function noRefCheck(){}
      },
      {
        onSelect: function noRefCheck(){},
        options: '[Circular]',
        optionsKey: 'name'
      },
      <div style={{display: 'flex', flexDirection: 'column', gap: '4px', justifyContent: 'flex-start'}}><Button label="link7" size="medium" style={{justifyContent: 'flex-start', padding: '0px'}} variation="link"/><div className="typography body-s">Description</div></div>
    ],
    [
      8,
      {
        label: 'HLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aeneanp',
        maxLength: 64
      },
      80000,
      {
        label: 'HLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quisppp',
        maxLength: 256
      },
      {
        alignment: '',
        className: '',
        icon: '',
        iconClassName: '',
        iconColor: '',
        label: 'Tag8',
        labelStyle: {},
        onClick: function noRefCheck(){},
        showIcon: false,
        stroke: true,
        style: {},
        type: 'success'
      },
      {
        className: '',
        disable: false,
        isCheckedInitially: false,
        isLabelFirst: false,
        label: 'Switch8',
        labelStyle: {},
        onToggle: function noRefCheck(){},
        shapeOnOff: true,
        style: {}
      },
      {
        hideDefaultActionIcon: false,
        icon: '',
        isDisabled: false,
        isSearchable: true,
        isSuffix: false,
        label: 'Button8',
        menuStyles: {},
        onClick: function noRefCheck(){},
        onSelect: function noRefCheck(){},
        options: [],
        optionsKey: 'name',
        showBottom: true,
        size: 'medium',
        style: {},
        textStyles: {},
        type: 'button',
        variation: 'primary'
      },
      {
        checked: false,
        disabled: false,
        hideLabel: false,
        isLabelFirst: false,
        label: 'Checkbox8',
        mainClassName: 'table-checkbox',
        onChange: function noRefCheck(){},
        props: {},
        style: {}
      },
      {
        type: 'text'
      },
      {
        option: '[Circular]',
        optionKey: 'name',
        select: function noRefCheck(){}
      },
      {
        onSelect: function noRefCheck(){},
        options: '[Circular]',
        optionsKey: 'name'
      },
      <div style={{display: 'flex', flexDirection: 'column', gap: '4px', justifyContent: 'flex-start'}}><Button label="link8" size="medium" style={{justifyContent: 'flex-start', padding: '0px'}} variation="link"/><div className="typography body-s">Description</div></div>
    ],
    [
      9,
      {
        label: 'ILorem ipsum dolor sit amet, consectetuer adipiscing elit. Aeneanp',
        maxLength: 64
      },
      90000,
      {
        label: 'ILorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quisppp',
        maxLength: 256
      },
      {
        alignment: '',
        className: '',
        icon: '',
        iconClassName: '',
        iconColor: '',
        label: 'Tag9',
        labelStyle: {},
        onClick: function noRefCheck(){},
        showIcon: false,
        stroke: true,
        style: {},
        type: 'error'
      },
      {
        className: '',
        disable: false,
        isCheckedInitially: false,
        isLabelFirst: false,
        label: 'Switch9',
        labelStyle: {},
        onToggle: function noRefCheck(){},
        shapeOnOff: true,
        style: {}
      },
      {
        hideDefaultActionIcon: false,
        icon: '',
        isDisabled: false,
        isSearchable: true,
        isSuffix: false,
        label: 'Button9',
        menuStyles: {},
        onClick: function noRefCheck(){},
        onSelect: function noRefCheck(){},
        options: [],
        optionsKey: 'name',
        showBottom: true,
        size: 'medium',
        style: {},
        textStyles: {},
        type: 'button',
        variation: 'primary'
      },
      {
        checked: false,
        disabled: false,
        hideLabel: false,
        isLabelFirst: false,
        label: 'Checkbox9',
        mainClassName: 'table-checkbox',
        onChange: function noRefCheck(){},
        props: {},
        style: {}
      },
      {
        type: 'text'
      },
      {
        option: '[Circular]',
        optionKey: 'name',
        select: function noRefCheck(){}
      },
      {
        onSelect: function noRefCheck(){},
        options: '[Circular]',
        optionsKey: 'name'
      },
      <div style={{display: 'flex', flexDirection: 'column', gap: '4px', justifyContent: 'flex-start'}}><Button label="link9" size="medium" style={{justifyContent: 'flex-start', padding: '0px'}} variation="link"/><div className="typography body-s">Description</div></div>
    ],
    [
      10,
      {
        label: 'JLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aeneanp',
        maxLength: 64
      },
      100000,
      {
        label: 'JLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quisppp',
        maxLength: 256
      },
      {
        alignment: '',
        className: '',
        icon: '',
        iconClassName: '',
        iconColor: '',
        label: 'Tag10',
        labelStyle: {},
        onClick: function noRefCheck(){},
        showIcon: false,
        stroke: true,
        style: {},
        type: 'warning'
      },
      {
        className: '',
        disable: false,
        isCheckedInitially: false,
        isLabelFirst: false,
        label: 'Switch10',
        labelStyle: {},
        onToggle: function noRefCheck(){},
        shapeOnOff: true,
        style: {}
      },
      {
        hideDefaultActionIcon: false,
        icon: '',
        isDisabled: false,
        isSearchable: true,
        isSuffix: false,
        label: 'Button10',
        menuStyles: {},
        onClick: function noRefCheck(){},
        onSelect: function noRefCheck(){},
        options: [],
        optionsKey: 'name',
        showBottom: true,
        size: 'medium',
        style: {},
        textStyles: {},
        type: 'button',
        variation: 'primary'
      },
      {
        checked: false,
        disabled: false,
        hideLabel: false,
        isLabelFirst: false,
        label: 'Checkbox10',
        mainClassName: 'table-checkbox',
        onChange: function noRefCheck(){},
        props: {},
        style: {}
      },
      {
        type: 'text'
      },
      {
        option: '[Circular]',
        optionKey: 'name',
        select: function noRefCheck(){}
      },
      {
        onSelect: function noRefCheck(){},
        options: '[Circular]',
        optionsKey: 'name'
      },
      <div style={{display: 'flex', flexDirection: 'column', gap: '4px', justifyContent: 'flex-start'}}><Button label="link10" size="medium" style={{justifyContent: 'flex-start', padding: '0px'}} variation="link"/><div className="typography body-s">Description</div></div>
    ]
  ]}
  selection={{
    addCheckbox: false,
    checkboxLabel: '',
    initialSelectedRows: [],
    onSelectedRowsChange: function noRefCheck(){},
    showSelectedState: false
  }}
  styles={{
    extraStyles: {},
    withAlternateBg: true,
    withBorder: true,
    withColumnDivider: true,
    withHeaderDivider: true,
    withRowDivider: true
  }}
/>






                                                     Figure 2.14.1 : TableMolecule


For more Information Visit : TableMolecule


2.15 TimelineMolecule


Overview
The TimelineMolecule component is a dynamic timeline display tool for showing sequential steps, such as a project's progress or a user's journey. It supports sorting, filtering, and expanding/collapsing past and future steps for a clean and customizable user experience. With labels and icons for navigation, this component enhances usability for complex timelines.
Key Features
Dynamic Sorting: Automatically organizes steps into "upcoming," "in-progress," and "completed" categories.
Expandable Sections: Allows users to expand or collapse past and future steps for better navigation.
Custom Icons and Labels: Use custom icons and labels for a tailored appearance.
Visibility Control: Display a limited number of steps initially, with options to show more.
Responsive Design: Works seamlessly for different devices and screen sizes.
Do: When to Use This Component
Use it to display a sequential flow, such as a project timeline or process stages.
Use it when you need to categorize steps as past, present, or future.
Use it when providing users with the ability to expand or collapse sections is essential.
Use it in dashboards or progress tracking pages.
Do Not: When Not to Use This Component
Avoid using this component for non-sequential or unordered data.
Do not use it if the steps lack clear categories (e.g., upcoming, in-progress, completed).
Avoid using it for highly interactive steps that require extensive customization.
Props for TimelineMolecule
Property
Description
children
The timeline steps to display. Each child is expected to be a Timeline component.
initialVisibleCount
Number of steps to display initially before expanding.
viewLessLabelForFuture
Label for the button to collapse future steps.
viewMoreLabelForFuture
Label for the button to expand future steps.
viewLessLabelForPast
Label for the button to collapse past steps.
viewMoreLabelForPast
Label for the button to expand past steps.
pastIcon
Icon to display for toggling past steps.
FutureIcon
Icon to display for toggling future steps.
hideFutureLabel
Boolean to hide the future label and button.
hidePastLabel
Boolean to hide the past label and button.


How to Use the TimelineMolecule
  <TimelineMolecule initialVisibleCount={3}>
    <Timeline
      label="Upcoming Timeline Step3"
      subElements={subElements}
      variant="upcoming"
      showConnector={true}
    />
    <Timeline
      label="Upcoming Timeline Step2"
      subElements={subElements}
      variant="upcoming"
      showConnector={true}
    />
    <Timeline
      label="Upcoming Timeline Step1"
      subElements={subElements}
      variant="upcoming"
      showConnector={true}
    />
    <Timeline
      label="Upcoming Timeline Step"
      subElements={subElements}
      variant="upcoming"
      showConnector={true}
    />
    <Timeline
      label="Inprogress Timeline Step"
      subElements={subElements}
      variant="inprogress"
      showConnector={true}
    />
    <Timeline
      label="Completed Timeline Step3"
      subElements={subElements}
      variant="completed"
      showConnector={true}
    />
    <Timeline
      label="Completed Timeline Step2"
      subElements={subElements}
      variant="completed"
      showConnector={true}
    />
    <Timeline
      label="Completed Timeline Step"
      subElements={subElements}
      variant="completed"
      showConnector={true}
    />
  </TimelineMolecule>

                                             Figure 2.15.1 : Timeline Molecule With Visible Count
Figure 2.15.2 : Timeline Molecule 

For more Information Visit : TimelineMolecule


2.16 TooltipWrapper


Overview
The TooltipWrapper component provides an easy way to show contextual information or hints when users interact with an element. It wraps a child element and displays a tooltip based on user actions such as hover, focus, or touch. The tooltip can be customized in terms of position, appearance, and behavior, making it a versatile tool for enhancing user experience.
Key Features
Customizable Placement: Tooltip can appear in various positions (top, bottom, left, right, etc.).
Delay Settings: Add delays for showing or hiding the tooltip for better interaction.
Interactive: Disable or enable tooltip interactivity based on your requirements.
Follow Cursor: Tooltip can dynamically follow the user's cursor position.
Custom Styles: Customize the appearance with style and class names.
Event Control: Control tooltip visibility with hover, focus, or touch listeners.
Do: When to Use This Component
Use it to provide additional information or context about an element (e.g., button descriptions, form field guidance).
Use it when you want to minimize clutter by hiding details until needed.
Use it in cases where accessibility features like focus-based visibility are important.
Do Not: When Not to Use This Component
Avoid using this component for critical or essential information that users need to see immediately.
Do not use tooltips if the content is too long or requires detailed formatting.
Avoid overusing tooltips, as they can overwhelm users with too many popups.
Props for TooltipWrapper
Property
Description
children
The element that the tooltip will wrap and interact with.
arrow
Displays an arrow pointing to the wrapped element. Defaults to true.
content
The content to be displayed inside the tooltip.
placement
Defines the tooltip's position relative to the element (e.g., top, bottom, left, right).
enterDelay
Delay (in milliseconds) before showing the tooltip. Default is 100.
leaveDelay
Delay (in milliseconds) before hiding the tooltip. Default is 0.
followCursor
If true, the tooltip will follow the user's cursor.
open
Controls the open state of the tooltip programmatically.
disableFocusListener
Disables tooltip visibility on focus events.
disableHoverListener
Disables tooltip visibility on hover events.
disableInteractive
Makes the tooltip non-interactive (closes when hovered).
disableTouchListener
Disables tooltip visibility on touch events.
onOpen
Callback function triggered when the tooltip opens.
onClose
Callback function triggered when the tooltip closes.
style
Inline styles to apply to the tooltip.
wrapperClassName
Custom class name for the wrapper element.
ClassName
Custom class name for the tooltip itself.
header
Optional header content for the tooltip.
description
Optional description for the tooltip.
theme
Theme of the tooltip : dark / light


How to Use the TooltipWrapper

<div
  style={{
    alignItems: 'center',
    color: '#363636',
    display: 'flex',
    justifyContent: 'center',
    left: '50%',
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  }}
>
  <TooltipWrapper
    content={<>And here's some amazing content It's very engaging. Right?<hr /><img alt="here is your logo" src="https://egov-uat-assets.s3.ap-south-1.amazonaws.com/hcm/mseva-white-logo.png"/></>}
    enterDelay={100}
    leaveDelay={0}
    placement="bottom"
  >
    <Button label="HtmlTooltip..." />
  </TooltipWrapper>
</div>

Figure 2.16.1 : TooltipWrapper


For more Information Visit : TooltipWrapper

MoleculeGroup

3.1 LandingPageWrapper

Overview
The LandingPageWrapper component acts as a container for landing page content. It dynamically adjusts the layout and dimensions of its child elements based on the viewport's aspect ratio. This ensures a responsive and consistent display across different devices, particularly optimizing for mobile views when the aspect ratio indicates a narrower screen.
Key Features
Responsive Design: Automatically adapts the layout for mobile and desktop views.
Dynamic Card Resizing: Ensures uniform card dimensions based on the largest card in desktop view.
Mobile Optimization: Cards stack vertically for better readability on smaller screens.
Customizable Appearance: Allows styling and class name customization.
Do: When to Use This Component
Use this component to structure landing pages with multiple elements that need responsive resizing and alignment.
Use it when the child elements (like cards or sections) should be consistently sized in desktop view but adapt seamlessly in mobile view.
Ideal for designing promotional pages, product showcases, or visually rich interfaces.
Do Not: When Not to Use This Component
Avoid using this component if the child elements require completely independent dimensions or alignment.
Not suitable for complex layouts where individual element positioning needs manual control.
Avoid using this component if the aspect ratio-based resizing logic doesn't fit your design requirements.
Props for LandingPageWrapper

Property
Description
children
The content to be rendered inside the wrapper. Typically includes cards or sections. Required.
className
Additional class names to style the wrapper. Default is an empty string.
styles
Inline styles for the wrapper element. Default is an empty object.


How to Use the LandingPageWrapper Component

    <LandingPageWrapper>
      <LandingPageCard
        icon="SupervisorAccount"
        moduleName="Dashboard"
        metrics={[
          { count: 10, label: "Active Users", link: "#" },
          { count: 20, label: "New Users", link: "#" },
        ]}
        links={[{ label: "View Dashboard", link: "#", icon: "Dashboard" }]}
      />
      <LandingPageCard
        icon="Person"
        moduleName="User Management"
        metrics={[
          { count: 100, label: "Total Users", link: "#" },
          { count: 50, label: "New Registrations", link: "#" },
        ]}
        links={[
          { label: "Add User", link: "#", icon: "Person" },
          { label: "Edit User", link: "#", icon: "Edit" },
        ]}
      />
      <LandingPageCard
        icon="Notifications"
        moduleName="Notifications"
        metrics={[{ count: 5, label: "New Notifications", link: "#" }]}
        links={[
          { label: "View Notifications", link: "#", icon: "Notifications" },
        ]}
      />
    </LandingPageWrapper>


				Figure 3.1.1 : LandingPageWrapper



For more Information Visit : LandingPageWrapper


3.2 MenuCardWrapper

Overview
The MenuCardWrapper component serves as a container for grouping multiple MenuCard components or similar elements. It helps in organizing and styling these cards uniformly within a customizable wrapper. This component allows you to provide a consistent layout for menu-related features in your application.
Key Features
Flexible Layout: Acts as a container for child elements like MenuCard.
Custom Styling: Supports custom CSS class names and inline styles for further customization.
Reusable: Simplifies the organization of similar elements in a visually consistent manner.
Seamless Integration: Compatible with any React component as children.
Do: When to Use This Component
Use this component to group and display multiple menu cards or similar UI elements in a consistent layout.
Use it when you want to manage and style a collection of cards as a single entity.
Ideal for creating dashboards, menus, or grouped lists.
Do Not: When Not to Use This Component
Do not use this component if you need complex grid or column-based layouts, as it is a basic wrapper.
Avoid using it for unrelated or highly varied child components that do not share a common purpose or design.
Do not use this component for rendering individual elements; it is intended for groups.
Props for MenuCardWrapper

Property
Description
children
The content to be displayed inside the wrapper. Typically includes multiple MenuCard elements. Required.
className
Additional class names for custom styling. Default is an empty string.
styles
Inline styles for the wrapper container. Default is an empty object.


How to Use the MenuCardWrapper Component
```jsx
<MenuCardWrapper>
  <React.Fragment key=".0">
    <MenuCard
      description="Use this checklist to supervise the team formation for Registration & Distribution"
      icon="Article"
      menuName="Menu"
      onClick={function noRefCheck(){}}
      styles={{}}
    />
    <MenuCard
      description="Use this checklist to supervise the team formation for Registration & Distribution"
      icon="Article"
      menuName="Menu"
      onClick={function noRefCheck(){}}
      styles={{}}
    />
    <MenuCard
      description="Use this checklist to supervise the team formation for Registration & Distribution"
      icon="Article"
      menuName="Menu"
      onClick={function noRefCheck(){}}
      styles={{}}
    />
  </React.Fragment>
</MenuCardWrapper>


			```	


                                               Figure 3.2.1 : MenuCardWrapper

For more Information Visit : MenuCardWrapper


