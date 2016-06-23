import { Class, IClassDefinition, IExtendable } from './class.ts'

export type CollectionRef = string | ( () => ICollection ) | ICollection

export interface CCollection extends IExtendable {
    new ( records? : Object[] | IRecord[], options? : {} ) : ICollection;
    subsetOf( ref : CollectionRef ) : IAttribute
}

export interface CRecord extends IExtendable {
    new ( attrs? : {}, options? : {} ) : IRecord;
    Collection : CCollection
    from( ref : CollectionRef ) : IAttribute
    define( spec? : IRecordDefinition, statics? : {} )
}

export interface IAttribute {

}

export interface IRecordDefinition extends IClassDefinition {
    attributes? : { [ name : string ] : IAttribute | Function | any }
    collection? : ICollectionDefinition
}

interface IRecordChanges {
    changed : {}
    hasChanged( key? : string ) : boolean
    previousAttributes() : {}
    changedAttributes( diff? : {} ) : {}
    previous( attribute: string ): any;
}

interface Options {
    silent?: boolean
}

interface ISerializable {
    parse( response: any, options?: {} ): any;
    toJSON( options?: {} ): any;
}

interface ITransactional {
    set( data : {}, options? : Options )
    transaction( self : ( self : this ) => void, options? : Options ) : void
    createTransaction( data : {}, options? : Options ) : ITransaction
}

interface ITransaction {
    commit( options? : Options ) : void
}

export interface IRecord extends Class, IEvents {
    idAttribute: string;
    id : string | number
    cid: string;

    Attributes : AttributesCtor
    attributes : Attributes
    defaults( attrs? : {} )
    initialize( values? : Object, options? : {} )
    clone( options? : { deep? : Boolean } ) : this

    collection : ICollection
    getOwner() : IRecord
}

export interface ICollectionDefinition extends IClassDefinition {
    Record? : CRecord
}

export interface ICollection extends Class {
    Record : CRecord

    initialize( models? : CollectionArg, options? : {} )

    add( models : CollectionArg, options? : {} )
    remove( models : CollectionArg, options? : {} )
    set( models : CollectionArg, options? : {} )
}

interface AttributesCtor {
    new ( values : {} ) : Attributes;
}

interface Attributes {}

type CollectionArg = Object[] | IRecord[]


export interface EventsHash {
    [events : string]: string | Function;
}

export interface IEvents{
    trigger(eventName: string, ...args: any[]): any;

    on(eventName: string, callback: Function, context?: any): any;
    on(eventMap: EventsHash): any;
    listenTo(object: any, events: EventsHash ): any;
    listenTo(object: any, events: string, callback: Function): any;

    once(events: string, callback: Function, context?: any): any;
    listenToOnce(object: any, events: string, callback: Function): any;

    off(eventName?: string, callback?: Function, context?: any): any;
    stopListening(object?: any, events?: string, callback?: Function): any;
}
