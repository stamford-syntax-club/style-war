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

export type Mutation = {
  __typename?: 'Mutation';
  setActiveChallenge?: Maybe<Challenge>;
  storeCode?: Maybe<Code>;
};


export type MutationSetActiveChallengeArgs = {
  setActiveChallengeInput: SetActiveChallengeInput;
};


export type MutationStoreCodeArgs = {
  storeCodeInput: StoreCodeInput;
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
  challenge_id?: InputMaybe<Scalars['Int']['input']>;
};

export type SetActiveChallengeInput = {
  duration: Scalars['Int']['input'];
  id: Scalars['Int']['input'];
};

export type StoreCodeInput = {
  challenge_id: Scalars['Int']['input'];
  code: Scalars['String']['input'];
};

export type ChallengeQueryVariables = Exact<{ [key: string]: never; }>;


export type ChallengeQuery = { __typename?: 'Query', challenge?: { __typename?: 'Challenge', imageUrl?: string | null, isActive?: boolean | null, objectives?: Array<string | null> | null } | null };

export type CodeQueryVariables = Exact<{
  challengeId: Scalars['Int']['input'];
}>;


export type CodeQuery = { __typename?: 'Query', code?: { __typename?: 'Code', id?: string | null, code?: string | null, challengeId?: number | null, userId?: string | null } | null };

export type SetActiveChallengeMutationVariables = Exact<{
  setActiveChallengeInput: SetActiveChallengeInput;
}>;


export type SetActiveChallengeMutation = { __typename?: 'Mutation', setActiveChallenge?: { __typename?: 'Challenge', id?: string | null } | null };


export const ChallengeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Challenge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"challenge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"objectives"}}]}}]}}]} as unknown as DocumentNode<ChallengeQuery, ChallengeQueryVariables>;
export const CodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Code"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"challengeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"challenge_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"challengeId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"challengeId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]} as unknown as DocumentNode<CodeQuery, CodeQueryVariables>;
export const SetActiveChallengeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetActiveChallenge"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"setActiveChallengeInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetActiveChallengeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setActiveChallenge"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"setActiveChallengeInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"setActiveChallengeInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<SetActiveChallengeMutation, SetActiveChallengeMutationVariables>;