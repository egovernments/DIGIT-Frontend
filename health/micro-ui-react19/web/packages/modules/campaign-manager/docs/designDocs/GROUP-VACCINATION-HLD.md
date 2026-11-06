# Group vaccination (CLF and Transit post ) HLD (admin console)

**Feature** :  Delivery strategy selection for polio campaigns   
**Module**:  campaign-manager  
**Issue** : [https://github.com/egovernments/DIGIT-Frontend/issues/4412](https://github.com/egovernments/DIGIT-Frontend/issues/4412)  
**Figma**: [https://www.figma.com/make/aRNpJFeKsdHbTDUB5mhiFP/Delivery-Strategy?p=f](https://www.figma.com/make/aRNpJFeKsdHbTDUB5mhiFP/Delivery-Strategy?p=f)  
**Author**:  Swathi   
**Version** 0.2 · corrected against the implementation   
**Date**: 11 September 2026 (updated 5 October 2026)

## 1. Problem
Polio campaign type so far has been house to house.But polio campaigns also have to reach children who are not at home like at schools, markets, health posts and community centres, and in transit at bus stations, border crossings and checkpoints. Should be able to record the count. What the console is missing is a way for the user to select which of these three delivery strategies a polio campaign will use.

## 2. Goals
Main goal for the console : User should be able to configure the delivery strategy for a single round polio campaign ( house to house / transit post / clf or combination of any of them ) 

They should be able to to set the delivery dates   
Should be able to configure delivery conditions and resources for selected delivery strategies.   
Make the microplan upload, and mobile app set up disabled until boundary data is selected and this delivery strategies are selected.   
Enable the Transit post and CLF module cards in the app config screen based on the user selection in the previous screen. 

## 3. Not in scope
As of now, no change to the microplan sheet upload flow.   
No change to any other campaign type.   
Multi round campaigns works in the same way as today. 

## 4. Existing Flow
Campaign type and single / multi round selection -> Campaign name and campaign dates selection -> Boundary data selection -> Cycle Configuration -> Delivery rules -> Summary of these and submission -> Campaign details -> then microplan sheet upload and mobile app setup. 

As of now, even single round campaigns do not have separate code, example bednet campaign is set up as single cycle and single delivery, with pre selection and disabled those cards. User can still select the delivery dates and data is saved in campaign data. 

## 5. Proposed flow
Campaign type and single / multi round selection -> Campaign name and campaign dates selection -> Boundary data selection -> Delivery setup ( Delivery dates + which delivery strategy ) -> Delivery rules (here tabs are the selected strategy) -> Summary of these and submission -> Campaign details -> then microplan sheet upload and mobile app setup. (these are enabled only after those previous screens data selection) 

## 6. Where does changes needed
[https://drive.google.com/file/d/1o0GWXBI0YgOmRdiCodvU1Zg4tQXYeKF4/view?usp=sharing](https://drive.google.com/file/d/1o0GWXBI0YgOmRdiCodvU1Zg4tQXYeKF4/view?usp=sharing)

In the delivery setup and delivery rules screen the main changes are needed.   
   
## 7. Components
| Component | What it does | Status |
| :---- | :---- | :---- |
| DeliverySetup | Delivery dates + strategy selection. this replaces CycleConfiguration for campaign types that uses strategies.   | New |
| DeliveryMethodSelection | The checkbox selection group. Read the list from mdms data.  | New |
| Edit strategy warning popup | Alert popup whenever app config setup is finished and user tries to edit any selected strategy | New - rendered inline in CampaignDetails.js, not a separate component |
| MultiTabcontext | Existing delivery rules screen, but now tabs show strategies instead of cycles.  | Changes needed |
| deliveryRulesSlice | Existing redux slice. Holds 1 cycle 1 delivery per strategy.  | Changes needed |
| setupCampaignHelpers | Existing save transformer.  | Changes needed |
| CampaignDetails | Home screen for other flow. | Changes needed |
| NewAppModule | Module card enablement | Changes needed |

## 8. Where data state is present
| State | Where it is present |
| :---- | :---- |
| Chosen strategies | Session storage under existing cycle config key |
| Delivery dates | Same place as cycle 1 from and to date |
| Conditions and resources per startegy | Redux (deliveryRulesSlice) |
| List of available strategies | MDMS  |

Knowingly, delivery setup writes the existing cycle configuration session key rather than adding a new key. The screen changes, but everything else remains the same. 

## 9. Data
No new API or any mdms schema change.   
Two things gets added, to what already is present. 

The strategy code on each delivery   
A list of chosen strategies on the campaign. 

Delivery dates are not a new field. They are cycle 1s start and end dates, which is exactly where a single-round campaign stores them today.The list of strategies comes from MDMS, not from code. The campaign type record gains a deliveryMethods array alongside its existing fields. For POLIO it holds HOUSEHOLDSTRATEGY (order 1), TRANSITPOST (order 2) and CLF (order 3). That array is the only source for the checkboxes, the tab labels, and for deciding whether this feature applies at all.

## 10. When the feature is active
A campaign type that lists deliveryMethods in MDMS gets the new screens. One that doesn't keep the cycle flow exactly as it is. No campaign type name appears anywhere in the module, so turning this on for another campaign type later is an MDMS change with no frontend code change.  
There is a second condition, the campaign must be single round. One cycle carries one set of delivery dates, and multi-round means several cycles with their own dates both cannot be true at once. Ideally the polio campaign type would allow single round only, the way bednet does, and the code check is a guard against a mis-configured record. 

## 11. How is the flow allowed
[https://drive.google.com/file/d/1xVZZRzVsU6q--VkCWGOpX8KYg5ePS2JD/view?usp=sharing](https://drive.google.com/file/d/1xVZZRzVsU6q--VkCWGOpX8KYg5ePS2JD/view?usp=sharing)

Today the microplan upload card checks boundary data selection only, and Mobile App Setup has no check at all. Both now also require a delivery strategy.Within Mobile App Setup, the Transit Post and CLF cards are enabled only if that strategy was chosen. Cards that weren't chosen stay visible but disabled hiding them would leave no clue that the module exists or how to enable it.  

## 12. Error handling
Three things can fail.

MDMS returns no strategy list : fall back to general cycles and deliveries logic. 

Campaign type lists strategies but the campaign was created multi round : fall back to the cycle flow.

Validation fails on a tab that isn't open: Name the strategy in the message. "Complete the delivery condition" tells the user nothing when there are three tabs and only one is wrong.

## 13. Accessibility
The strategy selection should be a labelled checkbox, with proper label, description and other information. Delivery Rules uses the shared Tab component and inherits its keyboard behaviour.Disable the microplan sheet upload and the mobile app setup until delivery strategies are selected. 

## 14. Decisions
A delivery strategy is a delivery, not a cycle. The obvious reading is that each strategy should get its own cycle, since both show up as tabs. It doesn't work. A cycle carries the delivery dates, and the console reads those dates from a list with one entry per cycle. Three strategies would create three cycles against one date range, and cycles two and three would be saved with no dates at all. Keeping one cycle and putting the strategies in the delivery slot avoids this and needs no change to how dates are handled.The strategy list lives on the campaign type, not in a new MDMS master. The record already carries the campaign's shape and is fetched once, so the strategy list belongs with it. (The 0.1 draft cited roundTypes as the precedent; the POLIO record has type: multiround and no roundTypes field, so that precedent needs re-checking.) A separate master would mean a second file to configure and a second fetch for no benefit. The cost is that labels are repeated if several campaign types offer the same strategy, which is acceptable and can be normalised later.Whether the feature is on is decided by configuration, not by a constant in the code. An earlier draft used a list of campaign type names in the module. Rejected ,the module already has one such list (MULTI_ROUND_BY_DEFAULT_PROJECT_TYPES) with a standing note to move it to MDMS, and there was no reason to add a second.

## 15. Risks
Position is used as identity. Existing code finds a delivery by its position in an array. That's correct when position means "second dose" and wrong when it means "which strategy", because the user can select any subset. This shows up in three places and might be the main source of bugs in this change.Delivery type gets set by tab position. Under the DOT1 observation strategy the code marks the first delivery DIRECT and the rest INDIRECT. The polio campaign type doesn't set an observation strategy, and the code defaults to DOT1 so left alone, CLF and Household would be saved INDIRECT purely because of where their tabs sit.

## 16. Testing strategy
Component tests for the new selection screen and for the retabbed Delivery Rules. Integration coverage for the round trip configure, save, reopen, and check each strategy's rules come back on its own tab. Explicit regression runs for a multi-round SMC campaign and an existing bednet campaign, since both share the screen being changed. 

## 17. Open questions
1.Does project-factory return the strategy code unchanged, or does it drop unknown fields? RESOLVED - it round trips; the code reads deliveryMethod back off a saved campaign.  
2. Should the polio campaign type allow a single round only? It currently allows both. STILL OPEN - the POLIO record carries type: multiround today.  
3. Confirm every strategy's delivery should be DIRECT. RESOLVED - yes, enforced in the reducer, the radio options and the reload path.