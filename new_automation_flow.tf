# epilot-automation_flow.new_automation_flow:
resource "epilot-automation_flow" "new_automation_flow" {
  actions = [
    jsonencode(
      {
        allow_failure = true
        config = {
          mapping_config = {
            config_id = epilot-entitymapping_entity_mapping.new_entity_mapping.id
            target_id = "b7434ac7-3959-4f89-9eeb-cb7d0f300bf8"
            version   = 2
          }
          target_schema = "contact"
        }
        created_automatically = true

        name = "Kontakt erstellt aus Block 'Persönliche Informationen' auf Schritt 'Persönliche Informationen'"
        type = "map-entity"
      }
    ),
    jsonencode(
      {
        allow_failure = true
        config = {
          mapping_config = {
            config_id = epilot-entitymapping_entity_mapping.new_entity_mapping.id
            target_id = "f07911e3-aeba-4070-b29c-677e65c17023"
            version   = 2
          }
        }
        created_automatically = true

        name = "Bestellung aus Journey"
        type = "cart-checkout"
      }
    ),
  ]
  enabled       = true
  entity_schema = "submission"
  flow_name     = "Journey Automation: Verkaufsjourney"

  triggers = [
    {
      journey_submit_trigger = {
        configuration = {
          source_id = epilot-journey_journey.new_journey.journey_id
        }
        type = "journey_submission"
      }
    },
  ]
}
