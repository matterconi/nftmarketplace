import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { AdminAddressSet } from "../generated/schema"
import { AdminAddressSet as AdminAddressSetEvent } from "../generated/Grant/Grant"
import { handleAdminAddressSet } from "../src/grant"
import { createAdminAddressSetEvent } from "./grant-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let adminAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newAdminAddressSetEvent = createAdminAddressSetEvent(adminAddress)
    handleAdminAddressSet(newAdminAddressSetEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("AdminAddressSet created and stored", () => {
    assert.entityCount("AdminAddressSet", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AdminAddressSet",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "adminAddress",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
