import * as gatsby from 'gatsby';
import * as gatsbyFs from 'gatsby-source-filesystem';
import * as imgixGatsby from '@imgix/gatsby';
import * as prismic from '@prismicio/client';
import * as prismicH from '@prismicio/helpers';
import * as prismicT from '@prismicio/types';
import * as prismicCustomTypes from '@prismicio/custom-types-client';
import * as gqlc from 'graphql-compose';
import * as RTE from 'fp-ts/ReaderTaskEither';
import * as nodeHelpers from 'gatsby-node-helpers';
import { NodeHelpers } from 'gatsby-node-helpers';
import { IterableElement as IterableElement$1, Simplify, SetRequired } from 'type-fest';
import * as gatsbyImage from 'gatsby-image';
import * as gatsbyPluginImage from 'gatsby-plugin-image';

declare type NormalizedDocumentValue<Value extends prismicT.PrismicDocument = prismicT.PrismicDocument> = Omit<Value, "alternate_languages" | "data"> & {
    __typename: string;
    _previewable: string;
    prismicId: string;
    alternate_languages: NormalizedAlternateLanguagesValue;
    data: NormalizedValueMap<Value["data"]>;
    dataRaw: Value["data"];
} & gatsby.NodeInput;

declare type NormalizedAlternateLanguagesValue = (prismicT.AlternateLanguage & {
    document?: NormalizedDocumentValue | null;
    raw: prismicT.AlternateLanguage;
})[];

declare type NormalizedDocumentDataValue<Value extends prismicT.PrismicDocument["data"] = prismicT.PrismicDocument["data"]> = NormalizedValueMap<Value>;

declare type NormalizedGroupValue<Value extends prismicT.GroupField = prismicT.GroupField> = NormalizedValueMap<IterableElement$1<Value>>[];

declare type NormalizedImageBase<Value extends prismicT.ImageFieldImage> = Value extends prismicT.FilledImageFieldImage ? Value & {
    fixed: gatsbyImage.FixedObject;
    fluid: gatsbyImage.FluidObject;
    gatsbyImageData: gatsbyPluginImage.IGatsbyImageData;
    localFile: {
        publicURL: Value["url"];
        childImageSharp: {
            fixed: gatsbyImage.FixedObject;
            fluid: gatsbyImage.FluidObject;
            gatsbyImageData: gatsbyPluginImage.IGatsbyImageData;
        };
    };
} : Value extends prismicT.EmptyImageFieldImage ? Value & {
    fixed: null;
    fluid: null;
    gatsbyImageData: null;
    localFile: null;
} : never;
declare type NormalizedImageValue<Value extends prismicT.ImageField> = NormalizedImageBase<Value> & {
    thumbnails: Record<string, NormalizedImageBase<prismicT.ImageFieldImage>>;
};

declare type NormalizedLinkValue<Value extends prismicT.LinkField> = Value & {
    url?: string | null;
    raw: Value;
    document?: PrismicDocumentNodeInput | null;
    localFile?: {
        publicURL: string;
    };
};

declare type NormalizedStructuredTextValue<Value extends StructuredTextField> = {
    html: string;
    text: string;
    richText: Value;
    raw: Value;
};

declare type NormalizedSliceValue<Value extends prismicT.Slice | prismicT.SharedSlice = prismicT.Slice | prismicT.SharedSlice> = Value extends prismicT.SharedSlice ? {
    __typename: string;
    id: string;
    slice_type: Value["slice_type"];
    slice_label: Value["slice_label"];
    variation: string;
    version: string;
    primary: NormalizedValueMap<Value["primary"]>;
    items: NormalizedValueMap<IterableElement$1<Value["items"]>>[];
} : {
    __typename: string;
    id: string;
    slice_type: Value["slice_type"];
    slice_label: Value["slice_label"];
    primary: NormalizedValueMap<Value["primary"]>;
    items: NormalizedValueMap<IterableElement$1<Value["items"]>>[];
};

declare type NormalizedSlicesValue<Value extends prismicT.SliceZone = prismicT.SliceZone> = NormalizedValue<Simplify<IterableElement$1<Value>>>[];

declare type StructuredTextField = prismicT.RichTextField | prismicT.TitleField;
declare type NormalizedValue<Value> = Value extends prismicT.PrismicDocument ? NormalizedDocumentValue<Value> : Value extends prismicT.PrismicDocument["data"] ? NormalizedDocumentDataValue<Value> : Value extends prismicT.PrismicDocument["alternate_languages"] ? NormalizedAlternateLanguagesValue : Value extends StructuredTextField ? NormalizedStructuredTextValue<Value> : Value extends prismicT.ImageField ? NormalizedImageValue<Value> : Value extends prismicT.LinkField ? NormalizedLinkValue<Value> : Value extends prismicT.GroupField ? NormalizedGroupValue<Value> : Value extends prismicT.SliceZone ? NormalizedSlicesValue<Value> : Value extends prismicT.Slice | prismicT.SharedSlice ? NormalizedSliceValue<Value> : Value;
declare type NormalizedValueMap<ValueMap extends Record<string, unknown>> = {
    [P in keyof ValueMap]: NormalizedValue<ValueMap[P]>;
};

declare type RuntimeConfig = {
    typePrefix?: string;
    linkResolver?: prismicH.LinkResolverFunction;
    imageImgixParams?: imgixGatsby.ImgixUrlParams;
    imagePlaceholderImgixParams?: imgixGatsby.ImgixUrlParams;
    htmlSerializer?: prismicH.HTMLMapSerializer | prismicH.HTMLFunctionSerializer;
    transformFieldName?: TransformFieldNameFn;
};
declare type SubscriberFn = () => void;
declare const createRuntime: (config?: RuntimeConfig) => Runtime;
declare class Runtime {
    #private;
    nodes: NormalizedDocumentValue[];
    typePaths: SerializedTypePath[];
    subscribers: SubscriberFn[];
    config: SetRequired<RuntimeConfig, "imageImgixParams" | "imagePlaceholderImgixParams" | "transformFieldName">;
    nodeHelpers: nodeHelpers.NodeHelpers;
    constructor(config?: RuntimeConfig);
    subscribe(callback: SubscriberFn): void;
    unsubscribe(callback: SubscriberFn): void;
    registerCustomTypeModel(model: prismicT.CustomTypeModel): SerializedTypePath[];
    registerCustomTypeModels(models: prismicT.CustomTypeModel[]): SerializedTypePath[];
    registerSharedSliceModel(model: prismicT.SharedSliceModel): SerializedTypePath[];
    registerSharedSliceModels(models: prismicT.SharedSliceModel[]): SerializedTypePath[];
    registerDocument<PrismicDocument extends prismicT.PrismicDocument>(document: PrismicDocument): NormalizedDocumentValue<PrismicDocument>;
    registerDocuments<PrismicDocument extends prismicT.PrismicDocument>(documents: PrismicDocument[]): NormalizedDocumentValue<PrismicDocument>[];
    normalizeDocument<PrismicDocument extends prismicT.PrismicDocument>(document: PrismicDocument): NormalizedDocumentValue<PrismicDocument>;
    normalize<Value>(value: Value, path: string[]): NormalizedValue<Value>;
    getNode<Document extends prismicT.PrismicDocument>(id: string): NormalizedDocumentValue<Document> | undefined;
    hasNode(id: string): boolean;
    getTypePath(path: string[]): SerializedTypePath | undefined;
    exportTypePaths(): string;
    importTypePaths(typePathsExport: string): TypePath[];
}

declare type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};
declare type UnknownRecord<K extends PropertyKey = PropertyKey> = Record<K, unknown>;
declare type IterableElement<TargetIterable> = TargetIterable extends Iterable<infer ElementType> ? ElementType : never;
declare type JoiValidationError = InstanceType<gatsby.PluginOptionsSchemaArgs["Joi"]["ValidationError"]>;
declare type PrismicDocumentNodeInput<TDocument extends prismicT.PrismicDocument = prismicT.PrismicDocument> = TDocument & gatsby.NodeInput & {
    prismicId: string;
};
declare enum TypePathKind {
    CustomType = "CustomType",
    SharedSliceVariation = "SharedSliceVariation",
    Field = "Field"
}
interface TypePath {
    kind: TypePathKind;
    path: string[];
    type: PrismicTypePathType;
}
interface SerializedTypePath extends Omit<TypePath, "path"> {
    path: string;
}
declare type TypePathNode = TypePath & gatsby.Node;
declare type TransformFieldNameFn = (fieldName: string) => string;
interface Dependencies {
    prismicClient: prismic.Client;
    createTypes: gatsby.Actions["createTypes"];
    createNode: gatsby.Actions["createNode"];
    buildObjectType: gatsby.NodePluginSchema["buildObjectType"];
    buildUnionType: gatsby.NodePluginSchema["buildUnionType"];
    buildEnumType: gatsby.NodePluginSchema["buildEnumType"];
    buildScalarType: gatsby.NodePluginSchema["buildScalarType"];
    buildInterfaceType: gatsby.NodePluginSchema["buildInterfaceType"];
    getNode: gatsby.SourceNodesArgs["getNode"];
    getNodes: gatsby.SourceNodesArgs["getNodes"];
    touchNode: gatsby.Actions["touchNode"];
    deleteNode: gatsby.Actions["deleteNode"];
    createNodeId: gatsby.NodePluginArgs["createNodeId"];
    createContentDigest: gatsby.NodePluginArgs["createContentDigest"];
    schema: gatsby.NodePluginSchema;
    cache: gatsby.GatsbyCache;
    store: gatsby.Store;
    reporter: gatsby.Reporter;
    reportInfo: gatsby.Reporter["info"];
    reportWarning: gatsby.Reporter["warn"];
    reportVerbose: gatsby.Reporter["verbose"];
    globalNodeHelpers: NodeHelpers;
    nodeHelpers: NodeHelpers;
    pluginOptions: PluginOptions;
    webhookBody?: unknown;
    createRemoteFileNode: typeof gatsbyFs.createRemoteFileNode;
    transformFieldName: TransformFieldNameFn;
    runtime: Runtime;
}
declare type ShouldDownloadFilesPredicate = (field: prismicT.ImageFieldImage | prismicT.LinkToMediaField) => boolean;
declare type UnpreparedPluginOptions = gatsby.PluginOptions & {
    repositoryName: string;
    accessToken?: string;
    apiEndpoint?: string;
    customTypesApiEndpoint?: string;
    releaseID?: string;
    graphQuery?: string;
    fetchLinks?: string[];
    lang?: string;
    pageSize?: number;
    linkResolver?: prismicH.LinkResolverFunction;
    routes?: prismic.Route[];
    htmlSerializer?: prismicH.HTMLFunctionSerializer | prismicH.HTMLMapSerializer;
    imageImgixParams?: imgixGatsby.ImgixUrlParams;
    imagePlaceholderImgixParams?: imgixGatsby.ImgixUrlParams;
    typePrefix?: string;
    webhookSecret?: string;
    shouldDownloadFiles?: boolean | ShouldDownloadFilesPredicate | Record<string, boolean | ShouldDownloadFilesPredicate>;
    createRemoteFileNode?: typeof gatsbyFs.createRemoteFileNode;
    transformFieldName?: TransformFieldNameFn;
    fetch?: prismic.FetchLike & prismicCustomTypes.FetchLike;
    customTypesApiToken?: string;
    /**
     * A record of all Custom Type API IDs mapped to their models.
     *
     * @deprecated Use the `customTypeModels` plugin option.
     */
    schemas?: Record<string, prismicT.CustomTypeModelDefinition>;
    /**
     * A list of all Custom Types models using the Custom Types API object shape.
     */
    customTypeModels?: prismicT.CustomTypeModel[];
    /**
     * A list of all Shared Slice models.
     */
    sharedSliceModels?: prismicT.SharedSliceModel[];
};
declare type PluginOptions = UnpreparedPluginOptions & Required<Pick<UnpreparedPluginOptions, "apiEndpoint" | "customTypeModels" | "sharedSliceModels" | "imageImgixParams" | "imagePlaceholderImgixParams" | "shouldDownloadFiles" | "createRemoteFileNode" | "transformFieldName" | "fetch">>;
declare type FieldConfigCreator<TSchema extends prismicT.CustomTypeModelField = prismicT.CustomTypeModelField> = (path: string[], schema: TSchema) => RTE.ReaderTaskEither<Dependencies, Error, gqlc.ObjectTypeComposerFieldConfigDefinition<unknown, unknown>>;
declare type PrismicTypePathType = PrismicSpecialType | typeof prismicT.CustomTypeModelFieldType[keyof typeof prismicT.CustomTypeModelFieldType] | typeof prismicT.CustomTypeModelSliceType[keyof typeof prismicT.CustomTypeModelSliceType];
declare enum PrismicSpecialType {
    Document = "Document",
    DocumentData = "DocumentData",
    SharedSliceVariation = "SharedSliceVariation",
    Unknown = "Unknown"
}
interface PrismicAPIDocumentNode extends prismicT.PrismicDocument, gatsby.Node {
    prismicId: string;
}
declare type PrismicWebhookBody = PrismicWebhookBodyApiUpdate | PrismicWebhookBodyTestTrigger;
declare enum PrismicWebhookType {
    APIUpdate = "api-update",
    TestTrigger = "test-trigger"
}
interface PrismicWebhookBodyBase {
    type: PrismicWebhookType;
    domain: string;
    apiUrl: string;
    secret: string | null;
}
interface PrismicWebhookBodyApiUpdate extends PrismicWebhookBodyBase {
    type: PrismicWebhookType.APIUpdate;
    masterRef?: string;
    releases: PrismicWebhookOperations<PrismicWebhookRelease>;
    masks: PrismicWebhookOperations<PrismicWebhookMask>;
    tags: PrismicWebhookOperations<PrismicWebhookTag>;
    documents: string[];
    experiments?: PrismicWebhookOperations<PrismicWebhookExperiment>;
}
interface PrismicWebhookBodyTestTrigger extends PrismicWebhookBodyBase {
    type: PrismicWebhookType.TestTrigger;
}
interface PrismicWebhookOperations<T> {
    update?: T[];
    addition?: T[];
    deletion?: T[];
}
interface PrismicWebhookMask {
    id: string;
    label: string;
}
interface PrismicWebhookTag {
    id: string;
}
interface PrismicWebhookRelease {
    id: string;
    ref: string;
    label: string;
    documents: string[];
}
/**
 * @deprecated Experiments are no longer supported by Prismic.
 */
interface PrismicWebhookExperiment {
    id: string;
    name: string;
    variations: PrismicWebhookExperimentVariation[];
}
/**
 * @deprecated Experiments are no longer supported by Prismic.
 */
interface PrismicWebhookExperimentVariation {
    id: string;
    ref: string;
    label: string;
}
declare type PrismicCustomTypeApiResponse = PrismicCustomTypeApiCustomType[];
interface PrismicCustomTypeApiCustomType<Model extends prismicT.CustomTypeModel = prismicT.CustomTypeModel> {
    id: string;
    label: string;
    repeatable: boolean;
    json: Model;
}

/**
 * Name of the plugin used to identify Nodes owned by this plugin.
 *
 * Note: This should always be in sync with package.json's `name` field.
 */
declare const PLUGIN_NAME = "gatsby-source-prismic";
/**
 * Global prefix used for all GraphQL types and, where necessary, fields.
 */
declare const GLOBAL_TYPE_PREFIX = "Prismic";
/**
 * Default endpoint used to fetch custom type JSON schemas from Prismic's Custom Type API.
 *
 * @see https://prismic.io/docs/technologies/custom-types-api
 */
declare const DEFAULT_CUSTOM_TYPES_API_ENDPOINT = "https://customtypes.prismic.io/customtypes";
/**
 * Prismic API document fields returned for image fields that are **not** thumbnails.
 *
 * These fields are filtered out from the API response to extract the field's
 * thumbnails. The API includes thumbnails adjacent to these fields.
 */
declare const PRISMIC_API_IMAGE_FIELDS: string[];
/**
 * Default Imgix URL parameters for `gatsby-plugin-image` fields.
 *
 * These defaults provide a good balance between image quality and filesize.
 *
 * @see https://docs.imgix.com/apis/rendering
 */
declare const DEFAULT_IMGIX_PARAMS: {
    readonly auto: "compress,format";
    readonly fit: "max";
};
/**
 * Default Imgix URL parameters for `gatsby-plugin-image` placeholder images.
 *
 * These defaults provide a good balance between image quality and filesize.
 * They are merged with the `imageImgixParams` plugin option.
 *
 * @see https://docs.imgix.com/apis/rendering
 */
declare const DEFAULT_PLACEHOLDER_IMGIX_PARAMS: {
    readonly w: 100;
    readonly blur: 15;
};
/**
 * Default Prismic language option used when fetching documents. The current
 * default fetches all languages.
 *
 * @see https://prismic.io/docs/technologies/query-by-language-rest-api
 */
declare const DEFAULT_LANG = "*";
/**
 * Format used for all plugin reporting. Includes the plugin's name and the
 * instance's repository name (helpful when multiple repositories are configured).
 */
declare const REPORTER_TEMPLATE = "gatsby-source-prismic(%s) - %s";
/**
 * Root node field used to compare static data with preview data. If values are
 * equal, the preview node can be treated as an updated version of the static node.
 *
 * This is an internal-use-only field used by `gatsby-plugin-prismic-previews`.
 */
declare const PREVIEWABLE_NODE_ID_FIELD = "_previewable";
/**
 * Message displayed to the user when a webhook's secret does not match the
 * secret configured in the site's `gatsby-config.js`.
 */
declare const WEBHOOK_SECRET_MISMATCH_MSG = "A webhook was received, but the webhook secret did not match the webhook secret provided in the plugin options. If this is unexpected, verify that the `webhookSecret` plugin option matches the webhook secret in your Prismic repository.";
/**
 * Message displayed to the user when a `test-trigger` webhook is received.
 */
declare const WEBHOOK_TEST_TRIGGER_SUCCESS_MSG = "Success! Received a test trigger webhook. When changes to your content are saved, Gatsby will automatically fetch the changes.";
/**
 * Message displayed to the user when a missing custom type schema is detected.
 */
declare const MISSING_SCHEMAS_MSG = "JSON schemas for all custom types are required";
/**
 * Format used to inform the user of a missing schema.
 */
declare const MISSING_SCHEMA_MSG = "JSON model for \"%s\" is missing. If the Custom Type is no longer in use, you may provide \"{}\" as the JSON model.";
declare const FORBIDDEN_ACCESS_WITHOUT_ACCESS_TOKEN = "Unable to access the Prismic repository. Check the repository name. If the repository is secured, provide an access token.";
declare const FORBIDDEN_ACCESS_WITH_ACCESS_TOKEN = "Unable to access the Prismic repository. Check that the correct repository name and access token are provided.";
declare const FORBIDDEN_CUSTOM_TYPES_API_ACCESS = "Unable to access the Prismic Custom Types API. Check the customTypesApiToken option.";
declare const NON_EXISTENT_RELEASE_WITH_ACCESS_TOKEN_MSG = "The given Release ID (\"%s\") could not be found. If the Release ID is correct, check that your access token has permission to view Releases.";
declare const NON_EXISTENT_RELEASE_WITHOUT_ACCESS_TOKEN_MSG = "The given Release ID (\"%s\") could not be found. If the Release ID is correct, you may need to provide an access token with permission to view Releases.";

export { DEFAULT_CUSTOM_TYPES_API_ENDPOINT, DEFAULT_IMGIX_PARAMS, DEFAULT_LANG, DEFAULT_PLACEHOLDER_IMGIX_PARAMS, Dependencies, FORBIDDEN_ACCESS_WITHOUT_ACCESS_TOKEN, FORBIDDEN_ACCESS_WITH_ACCESS_TOKEN, FORBIDDEN_CUSTOM_TYPES_API_ACCESS, FieldConfigCreator, GLOBAL_TYPE_PREFIX, IterableElement, JoiValidationError, MISSING_SCHEMAS_MSG, MISSING_SCHEMA_MSG, Mutable, NON_EXISTENT_RELEASE_WITHOUT_ACCESS_TOKEN_MSG, NON_EXISTENT_RELEASE_WITH_ACCESS_TOKEN_MSG, NormalizedDocumentValue, PLUGIN_NAME, PREVIEWABLE_NODE_ID_FIELD, PRISMIC_API_IMAGE_FIELDS, PluginOptions, PrismicAPIDocumentNode, PrismicCustomTypeApiCustomType, PrismicCustomTypeApiResponse, PrismicDocumentNodeInput, PrismicSpecialType, PrismicTypePathType, PrismicWebhookBody, PrismicWebhookBodyApiUpdate, PrismicWebhookBodyTestTrigger, PrismicWebhookRelease, PrismicWebhookType, REPORTER_TEMPLATE, Runtime, RuntimeConfig, SerializedTypePath, TransformFieldNameFn, TypePath, TypePathKind, TypePathNode, UnknownRecord, UnpreparedPluginOptions, WEBHOOK_SECRET_MISMATCH_MSG, WEBHOOK_TEST_TRIGGER_SUCCESS_MSG, createRuntime };
