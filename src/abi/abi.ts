import * as p from "@subsquid/evm-codec";
import { event, fun, viewFun, indexed, ContractBase } from "@subsquid/evm-abi";
import type {
  EventParams as EParams,
  FunctionArguments,
  FunctionReturn,
} from "@subsquid/evm-abi";

export const functions = {
  cancel_order: fun("0x9c5f444f", "cancel_order(uint64,uint64)", {
    market: p.uint64,
    order_id: p.uint64,
  }),
  close_position: fun(
    "0xf051c5da",
    "close_position(uint64,uint64,uint256,uint32)",
    {
      market: p.uint64,
      position_id: p.uint64,
      price: p.uint256,
      quantity: p.uint32,
    },
  ),
  create_market: fun(
    "0xaff6283d",
    "create_market(string,uint256,uint32,uint8,uint8,uint32,uint8)",
    {
      market: p.string,
      tick_size: p.uint256,
      lifetime: p.uint32,
      initial_margin: p.uint8,
      maintenance_margin: p.uint8,
      contract_unit: p.uint32,
      contract_unit_decimals: p.uint8,
    },
  ),
  "create_order(uint64,uint256,uint32,uint8,uint8)": fun(
    "0xbb2a8022",
    "create_order(uint64,uint256,uint32,uint8,uint8)",
    {
      market: p.uint64,
      price: p.uint256,
      quantity: p.uint32,
      order_side: p.uint8,
      margin: p.uint8,
    },
  ),
  "create_order(uint64,uint256,uint32,uint8)": fun(
    "0xcf583bae",
    "create_order(uint64,uint256,uint32,uint8)",
    {
      market: p.uint64,
      price: p.uint256,
      quantity: p.uint32,
      order_side: p.uint8,
    },
  ),
  delete_market: fun("0xd049d342", "delete_market(uint64)", {
    market: p.uint64,
  }),
  deposit: fun("0x6170c4b1", "deposit(uint64,uint256)", {
    market: p.uint64,
    amount: p.uint256,
  }),
  mark_to_market: fun("0xf410c8ec", "mark_to_market(uint64,uint64)", {
    market: p.uint64,
    position_id: p.uint64,
  }),
  oracle_price: fun("0xa5d61904", "oracle_price(uint64,uint256)", {
    market: p.uint64,
    price: p.uint256,
  }),
  withdraw: fun("0x43387983", "withdraw(uint64,uint256)", {
    market: p.uint64,
    amount: p.uint256,
  }),
  withdraw_all: fun("0x223e0228", "withdraw_all(uint64)", { market: p.uint64 }),
};

export class Contract extends ContractBase {}

/// Function types
export type Cancel_orderParams = FunctionArguments<
  typeof functions.cancel_order
>;
export type Cancel_orderReturn = FunctionReturn<typeof functions.cancel_order>;

export type Close_positionParams = FunctionArguments<
  typeof functions.close_position
>;
export type Close_positionReturn = FunctionReturn<
  typeof functions.close_position
>;

export type Create_marketParams = FunctionArguments<
  typeof functions.create_market
>;
export type Create_marketReturn = FunctionReturn<
  typeof functions.create_market
>;

export type Create_orderParams_0 = FunctionArguments<
  (typeof functions)["create_order(uint64,uint256,uint32,uint8,uint8)"]
>;
export type Create_orderReturn_0 = FunctionReturn<
  (typeof functions)["create_order(uint64,uint256,uint32,uint8,uint8)"]
>;

export type Create_orderParams_1 = FunctionArguments<
  (typeof functions)["create_order(uint64,uint256,uint32,uint8)"]
>;
export type Create_orderReturn_1 = FunctionReturn<
  (typeof functions)["create_order(uint64,uint256,uint32,uint8)"]
>;

export type Delete_marketParams = FunctionArguments<
  typeof functions.delete_market
>;
export type Delete_marketReturn = FunctionReturn<
  typeof functions.delete_market
>;

export type DepositParams = FunctionArguments<typeof functions.deposit>;
export type DepositReturn = FunctionReturn<typeof functions.deposit>;

export type Mark_to_marketParams = FunctionArguments<
  typeof functions.mark_to_market
>;
export type Mark_to_marketReturn = FunctionReturn<
  typeof functions.mark_to_market
>;

export type Oracle_priceParams = FunctionArguments<
  typeof functions.oracle_price
>;
export type Oracle_priceReturn = FunctionReturn<typeof functions.oracle_price>;

export type WithdrawParams = FunctionArguments<typeof functions.withdraw>;
export type WithdrawReturn = FunctionReturn<typeof functions.withdraw>;

export type Withdraw_allParams = FunctionArguments<
  typeof functions.withdraw_all
>;
export type Withdraw_allReturn = FunctionReturn<typeof functions.withdraw_all>;
