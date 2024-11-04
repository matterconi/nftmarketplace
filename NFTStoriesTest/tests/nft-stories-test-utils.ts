import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  TokenMinted,
  TokenTransferred
} from "../generated/NFTStoriesTest/NFTStoriesTest"

export function createTokenMintedEvent(
  owner: Address,
  tokenId: BigInt
): TokenMinted {
  let tokenMintedEvent = changetype<TokenMinted>(newMockEvent())

  tokenMintedEvent.parameters = new Array()

  tokenMintedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  tokenMintedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return tokenMintedEvent
}

export function createTokenTransferredEvent(
  from: Address,
  to: Address,
  tokenId: BigInt
): TokenTransferred {
  let tokenTransferredEvent = changetype<TokenTransferred>(newMockEvent())

  tokenTransferredEvent.parameters = new Array()

  tokenTransferredEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  tokenTransferredEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  tokenTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return tokenTransferredEvent
}
