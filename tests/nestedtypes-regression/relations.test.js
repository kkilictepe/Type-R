var Nested = require( 'type-r' ),
    chai = require( 'chai');

var { memberOf, subsetOf } = Nested;
        
require( 'type-r/globals' );

    var Record = Nested.Record,
        Store = Nested.Store;

    expect = chai.expect;

    describe( 'One-to-many and many-to-many relations', function(){
        var Something = Nested.Model.extend({
            attributes : {
                name : ''
            }
        });

        var collection = new Something.Collection([
            { id: 1, name : 1 },
            { id: 2, name : 2 },
            { id: 3, name : 3 }
        ]);

        describe( 'memberOf reference', function(){
            var A = Nested.Model.extend({
                attributes : {
                    ref : memberOf( collection )
                }
            });

            it( 'is initialized with null', function(){
                var m = new A();
                expect( m.ref ).to.be.null;
            });

            it( 'parse model id', function(){
                var m = new A({ ref : 1 });
                expect( m.ref.name ).to.equal( "1" );
            });

            it( 'can be assigned with model id', function(){
                var m = new A();
                m.ref = 1;
                expect( m.ref.name ).to.equal( "1" );

                m.set({ ref: 2 });
                expect( m.ref.name ).to.equal( "2" );
            });

            it( 'can be assigned with model', function(){
                var m = new A();
                m.ref = collection.first();
                expect( m.ref.name ).to.equal( "1" );
            });

            it( 'is serialized to model id', function(){
                var m = new A();
                m.ref = collection.first();
                var json = m.toJSON();
                expect( json.ref ).to.equal( 1 );
            });

            it( 'can use lazy reference to collection', function(){
                var A = Nested.Model.extend({
                    attributes : {
                        ref : memberOf( function(){ return collection; } )
                    }
                });

                var m = new A();
                m.ref = 1;
                expect( m.ref.name ).to.equal( "1" );
            });

            it( 'must return null when not resolved', function(){
                var A = Nested.Model.extend({
                    attributes : {
                        ref : memberOf( function(){ return this.__collection; } )
                    }
                });

                var m = new A();
                m.ref = 1;
                expect( m.ref ).to.be.null;

                m.__collection = collection;
                expect( m.ref.name ).to.equal( "1" );
            });
        });

        describe( 'Collection.subsetOf', function(){
            var A = Nested.Model.extend({
                attributes : {
                    refs : subsetOf( collection, Something.Collection )
                }
            });

            it( 'is initialized with empty collection', function(){
                var m = new A();
                expect( m.refs.length ).to.equal( 0 );
            });

            it( 'parse array of model ids', function(){
                var m = new A({ refs : [ 1 ] });
                expect( m.refs.first().name ).to.equal( "1" );
            });

            it( 'can be assigned with array of model ids', function(){
                var m = new A();
                m.refs = [ 1 ];
                expect( m.refs.first().name ).to.equal( "1" );
            });

            it( 'can be assigned with models array', function(){
                var m = new A();
                m.refs = [ collection.first() ];
                expect( m.refs.first().name ).to.equal( "1" );
            });

            it( 'is serialized to array of model ids', function(){
                var m = new A();
                m.refs = [ collection.first() ];
                var json = m.toJSON();
                expect( json.refs[ 0 ] ).to.equal( 1 );
            });

            it( 'can use lazy reference to collection', function(){
                var A = Nested.Model.extend({
                    attributes : {
                        refs : subsetOf( function(){ return collection; }, Something.Collection )
                    }
                });

                var m = new A();
                m.refs = [ 1 ];
                expect( m.refs.first().name ).to.equal( "1" );
            });
        });
    });

    describe( 'Nested relations', function(){
        var User = Nested.Model.extend({
            defaults : {
                name : '',
                roles : subsetOf( '~roles' )
            },

            collection : {
                fetch : function(){
                    this.reset([ {
                        id : 1,
                        name : 'admin',
                        roles : [ 1 ]
                    },{
                        id : 2,
                        name : 'user',
                        roles : [ 2 ]
                    }], { parse : true });

                    this.trigger( 'sync', this );

                    return new Promise(function( resolve, reject ) {
                        resolve('loaded');
                    });
                }
            }
        });

        var Role = Nested.Model.extend({
            defaults : {
                name : '',
                users : subsetOf( '~users' )
            },

            collection : {
                fetch : function(){
                    this.reset([ {
                        id : 1,
                        name : 'Administrators',
                        users : [ 1 ]
                    },{
                        id : 2,
                        name : 'Users',
                        users : [ 2 ]
                    }], { parse : true });

                    this.trigger( 'sync', this );
                    return new Promise(function( resolve, reject ) {
                        resolve('loaded');
                    });
                }
            }
        });

        it( 'can be initialized with a list of attributes', function(){
            var Store = Nested.Store.defaults({
                users : User.Collection,
                roles : Role.Collection
            });

            Nested.Store.global = new Store();
        });

        it( 'References are properly resolved', function(){
            var store = Nested.Store.global;  
            store.users.fetch();
            store.roles.fetch();

            expect( store.users.first().roles.first().name ).to.eql( 'Administrators' );
        });

    });

    describe( 'model.assignFrom()', () => {
        it( 'Sends change events when subsetOf attribute is changed', ()=>{
            var Item = Record.extend({
                attributes : {
                    name : String
                }                
            });

            var Test = Record.extend({
                attributes : {
                    items : subsetOf( '~items', Item.Collection )
                }
            });

            var TestStore = Store.extend({
                attributes : {
                    items : Item.Collection,
                    tests : Test.Collection    
                }
            });

            var store1 = new TestStore({
                items : [
                    { id : 1, name : "1" },
                    { id : 2, name : 2 }
                ],

                tests : {
                    id : 0,
                    items : [ 1, 2 ]
                }
            });

            var store2 = new TestStore({
                items : [
                    { id : 1, name : "1" },
                    { id : 2, name : 2 }
                ],

                tests : {
                    id : 0,
                    items : [ 1 ]
                }
            });

            var counter = 0;
            store1.on( 'change', () => counter++ );
            
            store1.assignFrom( store2 );

            expect( counter ).to.eql( 1 );
        });
    });
