import * as tslib_1 from "tslib";
import { define, predefine, tools } from '../object-plus';
import { Transactional } from '../transactions';
import { type } from './attrDef';
import { createAttributesMixin } from './mixin';
import { Record } from './record';
export * from './attrDef';
export * from './metatypes';
export { Record };
var assign = tools.assign, defaults = tools.defaults;
export function attributes(attrDefs) {
    var DefaultRecord = (function (_super) {
        tslib_1.__extends(DefaultRecord, _super);
        function DefaultRecord() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DefaultRecord.attributes = attrDefs;
        DefaultRecord = tslib_1.__decorate([
            define
        ], DefaultRecord);
        return DefaultRecord;
    }(Record));
    return DefaultRecord;
}
Record.onExtend = function (BaseClass) {
    Transactional.onExtend.call(this, BaseClass);
    var Class = this;
    var DefaultCollection = (function (_super) {
        tslib_1.__extends(DefaultCollection, _super);
        function DefaultCollection() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DefaultCollection.model = Class;
        DefaultCollection = tslib_1.__decorate([
            predefine
        ], DefaultCollection);
        return DefaultCollection;
    }(BaseClass.Collection));
    this.DefaultCollection = DefaultCollection;
    if (Class.Collection === BaseClass.Collection) {
        this.Collection = DefaultCollection;
    }
};
Record.onDefine = function (definition, BaseClass) {
    var baseProto = BaseClass.prototype;
    var _a = createAttributesMixin(this.attributes = getAttributes(definition), baseProto._attributes), properties = _a.properties, _localEvents = _a._localEvents, dynamicMixin = tslib_1.__rest(_a, ["properties", "_localEvents"]);
    assign(this.prototype, dynamicMixin);
    definition.properties = defaults(definition.properties || {}, properties);
    definition._localEvents = _localEvents;
    Transactional.onDefine.call(this, definition, BaseClass);
    this.DefaultCollection.define(definition.collection || {});
    this.Collection = definition.Collection;
    this.Collection.prototype.model = this;
    if (definition.endpoint)
        this.Collection.prototype._endpoint = definition.endpoint;
};
function getAttributes(_a) {
    var defaults = _a.defaults, attributes = _a.attributes, idAttribute = _a.idAttribute;
    var definition = attributes || defaults || {};
    if (idAttribute && !(idAttribute in definition)) {
        definition[idAttribute] = void 0;
    }
    return definition;
}
export function auto(proto, attrName) {
    if (typeof Reflect !== 'undefined' && Reflect.getMetadata) {
        if (attrName) {
            type(Reflect.getMetadata("design:type", proto, attrName)).as(proto, attrName);
        }
        else {
            var value_1 = proto;
            return function (proto, attrName) {
                type(Reflect.getMetadata("design:type", proto, attrName)).value(value_1).as(proto, attrName);
            };
        }
    }
    else {
        proto._log('error', 'Type-R:MissingImport', 'Add import "reflect-metadata"; as the first line of your app.');
    }
}
//# sourceMappingURL=index.js.map