import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  AdminAddressSet,
  Approval,
  ApprovalForAll,
  BatchMetadataUpdate,
  FeesWithdrawn,
  FundsWithdrawn,
  MarketItemBurned,
  MarketItemCreated,
  MarketItemPriceUpdated,
  MarketItemRelisted,
  MarketItemRemoved,
  MarketItemSold,
  MarketItemTransferred,
  MarketplaceAddressSet,
  MetadataUpdate,
  TokenCreated,
  Transfer
} from "../generated/NFTMarketplace/NFTMarketplace"

export function createAdminAddressSetEvent(
  adminAddress: Address
): AdminAddressSet {
  let adminAddressSetEvent = changetype<AdminAddressSet>(newMockEvent())

  adminAddressSetEvent.parameters = new Array()

  adminAddressSetEvent.parameters.push(
    new ethereum.EventParam(
      "adminAddress",
      ethereum.Value.fromAddress(adminAddress)
    )
  )

  return adminAddressSetEvent
}

export function createApprovalEvent(
  owner: Address,
  approved: Address,
  tokenId: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromAddress(approved))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return approvalEvent
}

export function createApprovalForAllEvent(
  owner: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createBatchMetadataUpdateEvent(
  _fromTokenId: BigInt,
  _toTokenId: BigInt
): BatchMetadataUpdate {
  let batchMetadataUpdateEvent = changetype<BatchMetadataUpdate>(newMockEvent())

  batchMetadataUpdateEvent.parameters = new Array()

  batchMetadataUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "_fromTokenId",
      ethereum.Value.fromUnsignedBigInt(_fromTokenId)
    )
  )
  batchMetadataUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "_toTokenId",
      ethereum.Value.fromUnsignedBigInt(_toTokenId)
    )
  )

  return batchMetadataUpdateEvent
}

export function createFeesWithdrawnEvent(
  user: Address,
  amount: BigInt
): FeesWithdrawn {
  let feesWithdrawnEvent = changetype<FeesWithdrawn>(newMockEvent())

  feesWithdrawnEvent.parameters = new Array()

  feesWithdrawnEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  feesWithdrawnEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return feesWithdrawnEvent
}

export function createFundsWithdrawnEvent(
  seller: Address,
  amount: BigInt
): FundsWithdrawn {
  let fundsWithdrawnEvent = changetype<FundsWithdrawn>(newMockEvent())

  fundsWithdrawnEvent.parameters = new Array()

  fundsWithdrawnEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  fundsWithdrawnEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return fundsWithdrawnEvent
}

export function createMarketItemBurnedEvent(
  tokenId: BigInt,
  owner: Address
): MarketItemBurned {
  let marketItemBurnedEvent = changetype<MarketItemBurned>(newMockEvent())

  marketItemBurnedEvent.parameters = new Array()

  marketItemBurnedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  marketItemBurnedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )

  return marketItemBurnedEvent
}

export function createMarketItemCreatedEvent(
  tokenId: BigInt,
  seller: Address,
  owner: Address,
  price: BigInt,
  sold: boolean
): MarketItemCreated {
  let marketItemCreatedEvent = changetype<MarketItemCreated>(newMockEvent())

  marketItemCreatedEvent.parameters = new Array()

  marketItemCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  marketItemCreatedEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  marketItemCreatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  marketItemCreatedEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )
  marketItemCreatedEvent.parameters.push(
    new ethereum.EventParam("sold", ethereum.Value.fromBoolean(sold))
  )

  return marketItemCreatedEvent
}

export function createMarketItemPriceUpdatedEvent(
  tokenId: BigInt,
  seller: Address,
  newPrice: BigInt
): MarketItemPriceUpdated {
  let marketItemPriceUpdatedEvent = changetype<MarketItemPriceUpdated>(
    newMockEvent()
  )

  marketItemPriceUpdatedEvent.parameters = new Array()

  marketItemPriceUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  marketItemPriceUpdatedEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  marketItemPriceUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newPrice",
      ethereum.Value.fromUnsignedBigInt(newPrice)
    )
  )

  return marketItemPriceUpdatedEvent
}

export function createMarketItemRelistedEvent(
  tokenId: BigInt,
  seller: Address,
  price: BigInt
): MarketItemRelisted {
  let marketItemRelistedEvent = changetype<MarketItemRelisted>(newMockEvent())

  marketItemRelistedEvent.parameters = new Array()

  marketItemRelistedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  marketItemRelistedEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  marketItemRelistedEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )

  return marketItemRelistedEvent
}

export function createMarketItemRemovedEvent(
  tokenId: BigInt,
  seller: Address
): MarketItemRemoved {
  let marketItemRemovedEvent = changetype<MarketItemRemoved>(newMockEvent())

  marketItemRemovedEvent.parameters = new Array()

  marketItemRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  marketItemRemovedEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )

  return marketItemRemovedEvent
}

export function createMarketItemSoldEvent(
  tokenId: BigInt,
  seller: Address,
  buyer: Address,
  price: BigInt
): MarketItemSold {
  let marketItemSoldEvent = changetype<MarketItemSold>(newMockEvent())

  marketItemSoldEvent.parameters = new Array()

  marketItemSoldEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  marketItemSoldEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  marketItemSoldEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  marketItemSoldEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )

  return marketItemSoldEvent
}

export function createMarketItemTransferredEvent(
  tokenId: BigInt,
  from: Address,
  to: Address
): MarketItemTransferred {
  let marketItemTransferredEvent = changetype<MarketItemTransferred>(
    newMockEvent()
  )

  marketItemTransferredEvent.parameters = new Array()

  marketItemTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  marketItemTransferredEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  marketItemTransferredEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )

  return marketItemTransferredEvent
}

export function createMarketplaceAddressSetEvent(
  marketplaceAddress: Address
): MarketplaceAddressSet {
  let marketplaceAddressSetEvent = changetype<MarketplaceAddressSet>(
    newMockEvent()
  )

  marketplaceAddressSetEvent.parameters = new Array()

  marketplaceAddressSetEvent.parameters.push(
    new ethereum.EventParam(
      "marketplaceAddress",
      ethereum.Value.fromAddress(marketplaceAddress)
    )
  )

  return marketplaceAddressSetEvent
}

export function createMetadataUpdateEvent(_tokenId: BigInt): MetadataUpdate {
  let metadataUpdateEvent = changetype<MetadataUpdate>(newMockEvent())

  metadataUpdateEvent.parameters = new Array()

  metadataUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "_tokenId",
      ethereum.Value.fromUnsignedBigInt(_tokenId)
    )
  )

  return metadataUpdateEvent
}

export function createTokenCreatedEvent(
  tokenId: BigInt,
  owner: Address
): TokenCreated {
  let tokenCreatedEvent = changetype<TokenCreated>(newMockEvent())

  tokenCreatedEvent.parameters = new Array()

  tokenCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  tokenCreatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )

  return tokenCreatedEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  tokenId: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return transferEvent
}
