/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Challenge = {
  __typename?: 'Challenge';
  id?: Maybe<Scalars['ID']['output']>;
  imageUrl?: Maybe<Scalars['String']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  objectives?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type Code = {
  __typename?: 'Code';
  challengeId?: Maybe<Scalars['Int']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  challenge?: Maybe<Challenge>;
  code?: Maybe<Code>;
};


export type QueryChallengeArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCodeArgs = {
  challengeId?: InputMaybe<Scalars['Int']['input']>;
};

export type CodeQueryVariables = Exact<{
  challengeId: Scalars['Int']['input'];
}>;


export type CodeQuery = { __typename?: 'Query', code?: { __typename?: 'Code', id?: string | null, code?: string | null, challengeId?: number | null, userId?: string | null } | null };


export const CodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Code"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"challengeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"challengeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"challengeId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"challengeId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]} as unknown as DocumentNode<CodeQuery, CodeQueryVariables>;