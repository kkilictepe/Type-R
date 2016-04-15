
class Attribute {
    constructor( name, options ){
        this.name = name;
        this.deepUpdate = false;
    }

    isCompatible( value ){ return value == null || value instanceof this.type; }

    // cast and set hook...
    convert( next, prev, options ){ return this.isCompatible( next ) ? next : new this.type( next, options ); }

    isChanged( next, prev ){ return !_.isEqual( next, prev ); }

    // event management, ownership, hooks, if any...
    handleChange( next, prev ){}

    createPropertySpec(){
        const { get, name } = this,
              getter = get ? // attach get pipeline
                       function(){
                           return get.call( this, this.attributes[ name ], name );
                       } :
                       function(){ // fast path for common case
                           return this.attributes[ name ];
                       };

        return {
            get : getter,
            set( value ){
                // fast path `set` for plain assignment
                setAttribute( this, name, value );
            }
        }
    }
}

class PrimitiveType extends Attribute {
    isCompatible( value ){ return value == null || typeof value === 'number'; } //todo

    // cast and set hook...
    convert( next ){ return next == null ? next : this.type( next ); }

    isChanged( next, prev ){ return next !== prev; }

    // event management, ownership, hooks, if any...
    handleChange( next, prev ){}
}

Number._attribute = String._attribute = Boolean._attribute = PrimitiveType;

class DateType extends Attribute {

}

Date._attribute = DateType;

/*
    Should be plain object.
 */
class ObjectType extends Attribute {
    convert( x ){
        if( typeof x === x )
    }
}

Object._attribute = ObjectType;

/*
    Should be plain array
 */
class ArrayType extends Attribute {
    convert( x ){
        if( !this.isCompatible( x ) ){
            typeError( x, ' should be an Array' );
            return [];
        }

        return x;
    }
}

Array._attribute = ArrayType;
