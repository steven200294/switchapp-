export enum MatchStatus {
  PENDING = "PENDING",
  MATCHED = "MATCHED",
  IN_DISCUSSION = "IN_DISCUSSION",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
}

export enum SwipeDirection {
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  SUPER_LIKE = "SUPER_LIKE",
}

export enum SwipeAction {
  LIKE = "like",
  NOPE = "nope",
  SUPER_LIKE = "super_like",
}

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum UserType {
  TENANT = "tenant",
  BUYER = "buyer",
}

export enum PropertyType {
  APARTMENT = "APARTMENT",
  HOUSE = "HOUSE",
  STUDIO = "STUDIO",
  LOFT = "LOFT",
  ROOM = "ROOM",
}

export enum PropertyStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  UNAVAILABLE = "unavailable",
  EXCHANGED = "exchanged",
}

export enum MatchType {
  EXCHANGE = "exchange",
  SWITCHPASS = "switchpass",
}
