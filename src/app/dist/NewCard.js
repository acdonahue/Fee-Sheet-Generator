this.NewCard = this.NewCard || {};
this.NewCard.js = (function(React2, react) {
  "use strict";
  const isRunningInWorker = () => typeof self !== "undefined" && self.__HUBSPOT_EXTENSION_WORKER__ === true;
  const fakeWorkerGlobals = {
    logger: {
      debug: (data) => {
        console.log(data);
      },
      info: (data) => {
        console.info(data);
      },
      warn: (data) => {
        console.warn(data);
      },
      error: (data) => {
        console.error(data);
      }
    },
    extend_V2: () => {
    },
    // @ts-expect-error we are not using the worker endpoint in tests env.
    __useExtensionContext: () => {
    }
  };
  const getWorkerGlobals = () => {
    return isRunningInWorker() ? self : fakeWorkerGlobals;
  };
  const extend_V2 = getWorkerGlobals().extend_V2;
  function serverless(name, options) {
    return self.serverless(name, options);
  }
  function fetch(url, options) {
    return self.hsFetch(url, options);
  }
  const hubspot = {
    extend: extend_V2,
    serverless,
    fetch
  };
  var jsxRuntime = { exports: {} };
  var reactJsxRuntime_development = {};
  var hasRequiredReactJsxRuntime_development;
  function requireReactJsxRuntime_development() {
    if (hasRequiredReactJsxRuntime_development) return reactJsxRuntime_development;
    hasRequiredReactJsxRuntime_development = 1;
    /**
     * @license React
     * react-jsx-runtime.development.js
     *
     * Copyright (c) Facebook, Inc. and its affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    {
      (function() {
        var React$1 = React2;
        var REACT_ELEMENT_TYPE = Symbol.for("react.element");
        var REACT_PORTAL_TYPE = Symbol.for("react.portal");
        var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
        var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
        var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
        var REACT_PROVIDER_TYPE = Symbol.for("react.provider");
        var REACT_CONTEXT_TYPE = Symbol.for("react.context");
        var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
        var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
        var REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list");
        var REACT_MEMO_TYPE = Symbol.for("react.memo");
        var REACT_LAZY_TYPE = Symbol.for("react.lazy");
        var REACT_OFFSCREEN_TYPE = Symbol.for("react.offscreen");
        var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
        var FAUX_ITERATOR_SYMBOL = "@@iterator";
        function getIteratorFn(maybeIterable) {
          if (maybeIterable === null || typeof maybeIterable !== "object") {
            return null;
          }
          var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
          if (typeof maybeIterator === "function") {
            return maybeIterator;
          }
          return null;
        }
        var ReactSharedInternals = React$1.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
        function error(format) {
          {
            {
              for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
              }
              printWarning("error", format, args);
            }
          }
        }
        function printWarning(level, format, args) {
          {
            var ReactDebugCurrentFrame2 = ReactSharedInternals.ReactDebugCurrentFrame;
            var stack = ReactDebugCurrentFrame2.getStackAddendum();
            if (stack !== "") {
              format += "%s";
              args = args.concat([stack]);
            }
            var argsWithFormat = args.map(function(item) {
              return String(item);
            });
            argsWithFormat.unshift("Warning: " + format);
            Function.prototype.apply.call(console[level], console, argsWithFormat);
          }
        }
        var enableScopeAPI = false;
        var enableCacheElement = false;
        var enableTransitionTracing = false;
        var enableLegacyHidden = false;
        var enableDebugTracing = false;
        var REACT_MODULE_REFERENCE;
        {
          REACT_MODULE_REFERENCE = Symbol.for("react.module.reference");
        }
        function isValidElementType(type) {
          if (typeof type === "string" || typeof type === "function") {
            return true;
          }
          if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden || type === REACT_OFFSCREEN_TYPE || enableScopeAPI || enableCacheElement || enableTransitionTracing) {
            return true;
          }
          if (typeof type === "object" && type !== null) {
            if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || // This needs to include all possible module reference object
            // types supported by any Flight configuration anywhere since
            // we don't know which Flight build this will end up being used
            // with.
            type.$$typeof === REACT_MODULE_REFERENCE || type.getModuleId !== void 0) {
              return true;
            }
          }
          return false;
        }
        function getWrappedName(outerType, innerType, wrapperName) {
          var displayName = outerType.displayName;
          if (displayName) {
            return displayName;
          }
          var functionName = innerType.displayName || innerType.name || "";
          return functionName !== "" ? wrapperName + "(" + functionName + ")" : wrapperName;
        }
        function getContextName(type) {
          return type.displayName || "Context";
        }
        function getComponentNameFromType(type) {
          if (type == null) {
            return null;
          }
          {
            if (typeof type.tag === "number") {
              error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue.");
            }
          }
          if (typeof type === "function") {
            return type.displayName || type.name || null;
          }
          if (typeof type === "string") {
            return type;
          }
          switch (type) {
            case REACT_FRAGMENT_TYPE:
              return "Fragment";
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_PROFILER_TYPE:
              return "Profiler";
            case REACT_STRICT_MODE_TYPE:
              return "StrictMode";
            case REACT_SUSPENSE_TYPE:
              return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
              return "SuspenseList";
          }
          if (typeof type === "object") {
            switch (type.$$typeof) {
              case REACT_CONTEXT_TYPE:
                var context = type;
                return getContextName(context) + ".Consumer";
              case REACT_PROVIDER_TYPE:
                var provider = type;
                return getContextName(provider._context) + ".Provider";
              case REACT_FORWARD_REF_TYPE:
                return getWrappedName(type, type.render, "ForwardRef");
              case REACT_MEMO_TYPE:
                var outerName = type.displayName || null;
                if (outerName !== null) {
                  return outerName;
                }
                return getComponentNameFromType(type.type) || "Memo";
              case REACT_LAZY_TYPE: {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init = lazyComponent._init;
                try {
                  return getComponentNameFromType(init(payload));
                } catch (x) {
                  return null;
                }
              }
            }
          }
          return null;
        }
        var assign = Object.assign;
        var disabledDepth = 0;
        var prevLog;
        var prevInfo;
        var prevWarn;
        var prevError;
        var prevGroup;
        var prevGroupCollapsed;
        var prevGroupEnd;
        function disabledLog() {
        }
        disabledLog.__reactDisabledLog = true;
        function disableLogs() {
          {
            if (disabledDepth === 0) {
              prevLog = console.log;
              prevInfo = console.info;
              prevWarn = console.warn;
              prevError = console.error;
              prevGroup = console.group;
              prevGroupCollapsed = console.groupCollapsed;
              prevGroupEnd = console.groupEnd;
              var props = {
                configurable: true,
                enumerable: true,
                value: disabledLog,
                writable: true
              };
              Object.defineProperties(console, {
                info: props,
                log: props,
                warn: props,
                error: props,
                group: props,
                groupCollapsed: props,
                groupEnd: props
              });
            }
            disabledDepth++;
          }
        }
        function reenableLogs() {
          {
            disabledDepth--;
            if (disabledDepth === 0) {
              var props = {
                configurable: true,
                enumerable: true,
                writable: true
              };
              Object.defineProperties(console, {
                log: assign({}, props, {
                  value: prevLog
                }),
                info: assign({}, props, {
                  value: prevInfo
                }),
                warn: assign({}, props, {
                  value: prevWarn
                }),
                error: assign({}, props, {
                  value: prevError
                }),
                group: assign({}, props, {
                  value: prevGroup
                }),
                groupCollapsed: assign({}, props, {
                  value: prevGroupCollapsed
                }),
                groupEnd: assign({}, props, {
                  value: prevGroupEnd
                })
              });
            }
            if (disabledDepth < 0) {
              error("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
            }
          }
        }
        var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
        var prefix;
        function describeBuiltInComponentFrame(name, source, ownerFn) {
          {
            if (prefix === void 0) {
              try {
                throw Error();
              } catch (x) {
                var match = x.stack.trim().match(/\n( *(at )?)/);
                prefix = match && match[1] || "";
              }
            }
            return "\n" + prefix + name;
          }
        }
        var reentry = false;
        var componentFrameCache;
        {
          var PossiblyWeakMap = typeof WeakMap === "function" ? WeakMap : Map;
          componentFrameCache = new PossiblyWeakMap();
        }
        function describeNativeComponentFrame(fn, construct) {
          if (!fn || reentry) {
            return "";
          }
          {
            var frame = componentFrameCache.get(fn);
            if (frame !== void 0) {
              return frame;
            }
          }
          var control;
          reentry = true;
          var previousPrepareStackTrace = Error.prepareStackTrace;
          Error.prepareStackTrace = void 0;
          var previousDispatcher;
          {
            previousDispatcher = ReactCurrentDispatcher.current;
            ReactCurrentDispatcher.current = null;
            disableLogs();
          }
          try {
            if (construct) {
              var Fake = function() {
                throw Error();
              };
              Object.defineProperty(Fake.prototype, "props", {
                set: function() {
                  throw Error();
                }
              });
              if (typeof Reflect === "object" && Reflect.construct) {
                try {
                  Reflect.construct(Fake, []);
                } catch (x) {
                  control = x;
                }
                Reflect.construct(fn, [], Fake);
              } else {
                try {
                  Fake.call();
                } catch (x) {
                  control = x;
                }
                fn.call(Fake.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (x) {
                control = x;
              }
              fn();
            }
          } catch (sample) {
            if (sample && control && typeof sample.stack === "string") {
              var sampleLines = sample.stack.split("\n");
              var controlLines = control.stack.split("\n");
              var s = sampleLines.length - 1;
              var c = controlLines.length - 1;
              while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
                c--;
              }
              for (; s >= 1 && c >= 0; s--, c--) {
                if (sampleLines[s] !== controlLines[c]) {
                  if (s !== 1 || c !== 1) {
                    do {
                      s--;
                      c--;
                      if (c < 0 || sampleLines[s] !== controlLines[c]) {
                        var _frame = "\n" + sampleLines[s].replace(" at new ", " at ");
                        if (fn.displayName && _frame.includes("<anonymous>")) {
                          _frame = _frame.replace("<anonymous>", fn.displayName);
                        }
                        {
                          if (typeof fn === "function") {
                            componentFrameCache.set(fn, _frame);
                          }
                        }
                        return _frame;
                      }
                    } while (s >= 1 && c >= 0);
                  }
                  break;
                }
              }
            }
          } finally {
            reentry = false;
            {
              ReactCurrentDispatcher.current = previousDispatcher;
              reenableLogs();
            }
            Error.prepareStackTrace = previousPrepareStackTrace;
          }
          var name = fn ? fn.displayName || fn.name : "";
          var syntheticFrame = name ? describeBuiltInComponentFrame(name) : "";
          {
            if (typeof fn === "function") {
              componentFrameCache.set(fn, syntheticFrame);
            }
          }
          return syntheticFrame;
        }
        function describeFunctionComponentFrame(fn, source, ownerFn) {
          {
            return describeNativeComponentFrame(fn, false);
          }
        }
        function shouldConstruct(Component) {
          var prototype = Component.prototype;
          return !!(prototype && prototype.isReactComponent);
        }
        function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
          if (type == null) {
            return "";
          }
          if (typeof type === "function") {
            {
              return describeNativeComponentFrame(type, shouldConstruct(type));
            }
          }
          if (typeof type === "string") {
            return describeBuiltInComponentFrame(type);
          }
          switch (type) {
            case REACT_SUSPENSE_TYPE:
              return describeBuiltInComponentFrame("Suspense");
            case REACT_SUSPENSE_LIST_TYPE:
              return describeBuiltInComponentFrame("SuspenseList");
          }
          if (typeof type === "object") {
            switch (type.$$typeof) {
              case REACT_FORWARD_REF_TYPE:
                return describeFunctionComponentFrame(type.render);
              case REACT_MEMO_TYPE:
                return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);
              case REACT_LAZY_TYPE: {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init = lazyComponent._init;
                try {
                  return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
                } catch (x) {
                }
              }
            }
          }
          return "";
        }
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        var loggedTypeFailures = {};
        var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
        function setCurrentlyValidatingElement(element) {
          {
            if (element) {
              var owner = element._owner;
              var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
              ReactDebugCurrentFrame.setExtraStackFrame(stack);
            } else {
              ReactDebugCurrentFrame.setExtraStackFrame(null);
            }
          }
        }
        function checkPropTypes(typeSpecs, values, location, componentName, element) {
          {
            var has = Function.call.bind(hasOwnProperty);
            for (var typeSpecName in typeSpecs) {
              if (has(typeSpecs, typeSpecName)) {
                var error$1 = void 0;
                try {
                  if (typeof typeSpecs[typeSpecName] !== "function") {
                    var err = Error((componentName || "React class") + ": " + location + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                    err.name = "Invariant Violation";
                    throw err;
                  }
                  error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
                } catch (ex) {
                  error$1 = ex;
                }
                if (error$1 && !(error$1 instanceof Error)) {
                  setCurrentlyValidatingElement(element);
                  error("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", componentName || "React class", location, typeSpecName, typeof error$1);
                  setCurrentlyValidatingElement(null);
                }
                if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
                  loggedTypeFailures[error$1.message] = true;
                  setCurrentlyValidatingElement(element);
                  error("Failed %s type: %s", location, error$1.message);
                  setCurrentlyValidatingElement(null);
                }
              }
            }
          }
        }
        var isArrayImpl = Array.isArray;
        function isArray(a) {
          return isArrayImpl(a);
        }
        function typeName(value) {
          {
            var hasToStringTag = typeof Symbol === "function" && Symbol.toStringTag;
            var type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            return type;
          }
        }
        function willCoercionThrow(value) {
          {
            try {
              testStringCoercion(value);
              return false;
            } catch (e) {
              return true;
            }
          }
        }
        function testStringCoercion(value) {
          return "" + value;
        }
        function checkKeyStringCoercion(value) {
          {
            if (willCoercionThrow(value)) {
              error("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", typeName(value));
              return testStringCoercion(value);
            }
          }
        }
        var ReactCurrentOwner = ReactSharedInternals.ReactCurrentOwner;
        var RESERVED_PROPS = {
          key: true,
          ref: true,
          __self: true,
          __source: true
        };
        var specialPropKeyWarningShown;
        var specialPropRefWarningShown;
        function hasValidRef(config) {
          {
            if (hasOwnProperty.call(config, "ref")) {
              var getter = Object.getOwnPropertyDescriptor(config, "ref").get;
              if (getter && getter.isReactWarning) {
                return false;
              }
            }
          }
          return config.ref !== void 0;
        }
        function hasValidKey(config) {
          {
            if (hasOwnProperty.call(config, "key")) {
              var getter = Object.getOwnPropertyDescriptor(config, "key").get;
              if (getter && getter.isReactWarning) {
                return false;
              }
            }
          }
          return config.key !== void 0;
        }
        function warnIfStringRefCannotBeAutoConverted(config, self2) {
          {
            if (typeof config.ref === "string" && ReactCurrentOwner.current && self2) ;
          }
        }
        function defineKeyPropWarningGetter(props, displayName) {
          {
            var warnAboutAccessingKey = function() {
              if (!specialPropKeyWarningShown) {
                specialPropKeyWarningShown = true;
                error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
              }
            };
            warnAboutAccessingKey.isReactWarning = true;
            Object.defineProperty(props, "key", {
              get: warnAboutAccessingKey,
              configurable: true
            });
          }
        }
        function defineRefPropWarningGetter(props, displayName) {
          {
            var warnAboutAccessingRef = function() {
              if (!specialPropRefWarningShown) {
                specialPropRefWarningShown = true;
                error("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
              }
            };
            warnAboutAccessingRef.isReactWarning = true;
            Object.defineProperty(props, "ref", {
              get: warnAboutAccessingRef,
              configurable: true
            });
          }
        }
        var ReactElement = function(type, key, ref, self2, source, owner, props) {
          var element = {
            // This tag allows us to uniquely identify this as a React Element
            $$typeof: REACT_ELEMENT_TYPE,
            // Built-in properties that belong on the element
            type,
            key,
            ref,
            props,
            // Record the component responsible for creating this element.
            _owner: owner
          };
          {
            element._store = {};
            Object.defineProperty(element._store, "validated", {
              configurable: false,
              enumerable: false,
              writable: true,
              value: false
            });
            Object.defineProperty(element, "_self", {
              configurable: false,
              enumerable: false,
              writable: false,
              value: self2
            });
            Object.defineProperty(element, "_source", {
              configurable: false,
              enumerable: false,
              writable: false,
              value: source
            });
            if (Object.freeze) {
              Object.freeze(element.props);
              Object.freeze(element);
            }
          }
          return element;
        };
        function jsxDEV(type, config, maybeKey, source, self2) {
          {
            var propName;
            var props = {};
            var key = null;
            var ref = null;
            if (maybeKey !== void 0) {
              {
                checkKeyStringCoercion(maybeKey);
              }
              key = "" + maybeKey;
            }
            if (hasValidKey(config)) {
              {
                checkKeyStringCoercion(config.key);
              }
              key = "" + config.key;
            }
            if (hasValidRef(config)) {
              ref = config.ref;
              warnIfStringRefCannotBeAutoConverted(config, self2);
            }
            for (propName in config) {
              if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
                props[propName] = config[propName];
              }
            }
            if (type && type.defaultProps) {
              var defaultProps = type.defaultProps;
              for (propName in defaultProps) {
                if (props[propName] === void 0) {
                  props[propName] = defaultProps[propName];
                }
              }
            }
            if (key || ref) {
              var displayName = typeof type === "function" ? type.displayName || type.name || "Unknown" : type;
              if (key) {
                defineKeyPropWarningGetter(props, displayName);
              }
              if (ref) {
                defineRefPropWarningGetter(props, displayName);
              }
            }
            return ReactElement(type, key, ref, self2, source, ReactCurrentOwner.current, props);
          }
        }
        var ReactCurrentOwner$1 = ReactSharedInternals.ReactCurrentOwner;
        var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;
        function setCurrentlyValidatingElement$1(element) {
          {
            if (element) {
              var owner = element._owner;
              var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
              ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
            } else {
              ReactDebugCurrentFrame$1.setExtraStackFrame(null);
            }
          }
        }
        var propTypesMisspellWarningShown;
        {
          propTypesMisspellWarningShown = false;
        }
        function isValidElement(object) {
          {
            return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
          }
        }
        function getDeclarationErrorAddendum() {
          {
            if (ReactCurrentOwner$1.current) {
              var name = getComponentNameFromType(ReactCurrentOwner$1.current.type);
              if (name) {
                return "\n\nCheck the render method of `" + name + "`.";
              }
            }
            return "";
          }
        }
        function getSourceInfoErrorAddendum(source) {
          {
            return "";
          }
        }
        var ownerHasKeyUseWarning = {};
        function getCurrentComponentErrorInfo(parentType) {
          {
            var info = getDeclarationErrorAddendum();
            if (!info) {
              var parentName = typeof parentType === "string" ? parentType : parentType.displayName || parentType.name;
              if (parentName) {
                info = "\n\nCheck the top-level render call using <" + parentName + ">.";
              }
            }
            return info;
          }
        }
        function validateExplicitKey(element, parentType) {
          {
            if (!element._store || element._store.validated || element.key != null) {
              return;
            }
            element._store.validated = true;
            var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
            if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
              return;
            }
            ownerHasKeyUseWarning[currentComponentErrorInfo] = true;
            var childOwner = "";
            if (element && element._owner && element._owner !== ReactCurrentOwner$1.current) {
              childOwner = " It was passed a child from " + getComponentNameFromType(element._owner.type) + ".";
            }
            setCurrentlyValidatingElement$1(element);
            error('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', currentComponentErrorInfo, childOwner);
            setCurrentlyValidatingElement$1(null);
          }
        }
        function validateChildKeys(node, parentType) {
          {
            if (typeof node !== "object") {
              return;
            }
            if (isArray(node)) {
              for (var i = 0; i < node.length; i++) {
                var child = node[i];
                if (isValidElement(child)) {
                  validateExplicitKey(child, parentType);
                }
              }
            } else if (isValidElement(node)) {
              if (node._store) {
                node._store.validated = true;
              }
            } else if (node) {
              var iteratorFn = getIteratorFn(node);
              if (typeof iteratorFn === "function") {
                if (iteratorFn !== node.entries) {
                  var iterator = iteratorFn.call(node);
                  var step;
                  while (!(step = iterator.next()).done) {
                    if (isValidElement(step.value)) {
                      validateExplicitKey(step.value, parentType);
                    }
                  }
                }
              }
            }
          }
        }
        function validatePropTypes(element) {
          {
            var type = element.type;
            if (type === null || type === void 0 || typeof type === "string") {
              return;
            }
            var propTypes;
            if (typeof type === "function") {
              propTypes = type.propTypes;
            } else if (typeof type === "object" && (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
            // Inner props are checked in the reconciler.
            type.$$typeof === REACT_MEMO_TYPE)) {
              propTypes = type.propTypes;
            } else {
              return;
            }
            if (propTypes) {
              var name = getComponentNameFromType(type);
              checkPropTypes(propTypes, element.props, "prop", name, element);
            } else if (type.PropTypes !== void 0 && !propTypesMisspellWarningShown) {
              propTypesMisspellWarningShown = true;
              var _name = getComponentNameFromType(type);
              error("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", _name || "Unknown");
            }
            if (typeof type.getDefaultProps === "function" && !type.getDefaultProps.isReactClassApproved) {
              error("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
            }
          }
        }
        function validateFragmentProps(fragment) {
          {
            var keys = Object.keys(fragment.props);
            for (var i = 0; i < keys.length; i++) {
              var key = keys[i];
              if (key !== "children" && key !== "key") {
                setCurrentlyValidatingElement$1(fragment);
                error("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", key);
                setCurrentlyValidatingElement$1(null);
                break;
              }
            }
            if (fragment.ref !== null) {
              setCurrentlyValidatingElement$1(fragment);
              error("Invalid attribute `ref` supplied to `React.Fragment`.");
              setCurrentlyValidatingElement$1(null);
            }
          }
        }
        var didWarnAboutKeySpread = {};
        function jsxWithValidation(type, props, key, isStaticChildren, source, self2) {
          {
            var validType = isValidElementType(type);
            if (!validType) {
              var info = "";
              if (type === void 0 || typeof type === "object" && type !== null && Object.keys(type).length === 0) {
                info += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.";
              }
              var sourceInfo = getSourceInfoErrorAddendum();
              if (sourceInfo) {
                info += sourceInfo;
              } else {
                info += getDeclarationErrorAddendum();
              }
              var typeString;
              if (type === null) {
                typeString = "null";
              } else if (isArray(type)) {
                typeString = "array";
              } else if (type !== void 0 && type.$$typeof === REACT_ELEMENT_TYPE) {
                typeString = "<" + (getComponentNameFromType(type.type) || "Unknown") + " />";
                info = " Did you accidentally export a JSX literal instead of a component?";
              } else {
                typeString = typeof type;
              }
              error("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", typeString, info);
            }
            var element = jsxDEV(type, props, key, source, self2);
            if (element == null) {
              return element;
            }
            if (validType) {
              var children = props.children;
              if (children !== void 0) {
                if (isStaticChildren) {
                  if (isArray(children)) {
                    for (var i = 0; i < children.length; i++) {
                      validateChildKeys(children[i], type);
                    }
                    if (Object.freeze) {
                      Object.freeze(children);
                    }
                  } else {
                    error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
                  }
                } else {
                  validateChildKeys(children, type);
                }
              }
            }
            {
              if (hasOwnProperty.call(props, "key")) {
                var componentName = getComponentNameFromType(type);
                var keys = Object.keys(props).filter(function(k) {
                  return k !== "key";
                });
                var beforeExample = keys.length > 0 ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
                if (!didWarnAboutKeySpread[componentName + beforeExample]) {
                  var afterExample = keys.length > 0 ? "{" + keys.join(": ..., ") + ": ...}" : "{}";
                  error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', beforeExample, componentName, afterExample, componentName);
                  didWarnAboutKeySpread[componentName + beforeExample] = true;
                }
              }
            }
            if (type === REACT_FRAGMENT_TYPE) {
              validateFragmentProps(element);
            } else {
              validatePropTypes(element);
            }
            return element;
          }
        }
        function jsxWithValidationStatic(type, props, key) {
          {
            return jsxWithValidation(type, props, key, true);
          }
        }
        function jsxWithValidationDynamic(type, props, key) {
          {
            return jsxWithValidation(type, props, key, false);
          }
        }
        var jsx = jsxWithValidationDynamic;
        var jsxs = jsxWithValidationStatic;
        reactJsxRuntime_development.Fragment = REACT_FRAGMENT_TYPE;
        reactJsxRuntime_development.jsx = jsx;
        reactJsxRuntime_development.jsxs = jsxs;
      })();
    }
    return reactJsxRuntime_development;
  }
  var hasRequiredJsxRuntime;
  function requireJsxRuntime() {
    if (hasRequiredJsxRuntime) return jsxRuntime.exports;
    hasRequiredJsxRuntime = 1;
    {
      jsxRuntime.exports = requireReactJsxRuntime_development();
    }
    return jsxRuntime.exports;
  }
  var jsxRuntimeExports = requireJsxRuntime();
  const createRemoteComponentRegistry = () => {
    const componentMetadataLookup = /* @__PURE__ */ new Map();
    const componentNameByComponentMap = /* @__PURE__ */ new Map();
    const registerComponent = (component, componentName, fragmentProps) => {
      componentNameByComponentMap.set(component, componentName);
      componentMetadataLookup.set(componentName, {
        fragmentPropsSet: new Set(fragmentProps),
        fragmentPropsArray: fragmentProps
      });
      return component;
    };
    return {
      getComponentName: (component) => {
        const componentName = componentNameByComponentMap.get(component);
        if (!componentName) {
          return null;
        }
        return componentName;
      },
      isAllowedComponentName: (componentName) => {
        return componentMetadataLookup.has(componentName);
      },
      isComponentFragmentProp: (componentName, propName) => {
        const componentMetadata = componentMetadataLookup.get(componentName);
        if (!componentMetadata) {
          return false;
        }
        return componentMetadata.fragmentPropsSet.has(propName);
      },
      getComponentFragmentPropNames: (componentName) => {
        const componentMetadata = componentMetadataLookup.get(componentName);
        if (!componentMetadata) {
          return [];
        }
        const { fragmentPropsArray } = componentMetadata;
        return fragmentPropsArray;
      },
      createAndRegisterRemoteReactComponent: (componentName, options = {}) => {
        const { fragmentProps = [] } = options;
        const remoteReactComponent = react.createRemoteReactComponent(componentName, {
          fragmentProps
        });
        return registerComponent(remoteReactComponent, componentName, fragmentProps);
      },
      createAndRegisterRemoteCompoundReactComponent: (componentName, options) => {
        const { fragmentProps = [] } = options;
        const RemoteComponentType = react.createRemoteReactComponent(componentName, {
          fragmentProps
        });
        const CompoundFunctionComponentType = typeof RemoteComponentType === "function" ? RemoteComponentType : (props) => jsxRuntimeExports.jsx(RemoteComponentType, { ...props });
        Object.assign(CompoundFunctionComponentType, options.compoundComponentProperties);
        return registerComponent(CompoundFunctionComponentType, componentName, fragmentProps);
      }
    };
  };
  const __hubSpotComponentRegistry = createRemoteComponentRegistry();
  const { createAndRegisterRemoteReactComponent, createAndRegisterRemoteCompoundReactComponent } = __hubSpotComponentRegistry;
  createAndRegisterRemoteReactComponent("Alert");
  const Button = createAndRegisterRemoteReactComponent("Button", {
    fragmentProps: ["overlay"]
  });
  const ButtonRow = createAndRegisterRemoteReactComponent("ButtonRow");
  createAndRegisterRemoteReactComponent("Card");
  createAndRegisterRemoteReactComponent("DescriptionList");
  createAndRegisterRemoteReactComponent("DescriptionListItem");
  createAndRegisterRemoteReactComponent("Divider");
  createAndRegisterRemoteReactComponent("EmptyState");
  createAndRegisterRemoteReactComponent("ErrorState");
  createAndRegisterRemoteReactComponent("Form");
  createAndRegisterRemoteReactComponent("Heading");
  const Image = createAndRegisterRemoteReactComponent("Image", {
    fragmentProps: ["overlay"]
  });
  createAndRegisterRemoteReactComponent("Input");
  const Link = createAndRegisterRemoteReactComponent("Link", {
    fragmentProps: ["overlay"]
  });
  createAndRegisterRemoteReactComponent("TextArea");
  createAndRegisterRemoteReactComponent("Textarea");
  createAndRegisterRemoteReactComponent("LoadingSpinner");
  createAndRegisterRemoteReactComponent("ProgressBar");
  createAndRegisterRemoteReactComponent("Select");
  createAndRegisterRemoteReactComponent("Tag", {
    fragmentProps: ["overlay"]
  });
  const Text = createAndRegisterRemoteReactComponent("Text");
  const Tile = createAndRegisterRemoteReactComponent("Tile");
  createAndRegisterRemoteReactComponent("Stack");
  createAndRegisterRemoteReactComponent("ToggleGroup");
  createAndRegisterRemoteReactComponent("StatisticsItem");
  createAndRegisterRemoteReactComponent("Statistics");
  createAndRegisterRemoteReactComponent("StatisticsTrend");
  createAndRegisterRemoteReactComponent("Table");
  createAndRegisterRemoteReactComponent("TableFooter");
  createAndRegisterRemoteReactComponent("TableCell");
  createAndRegisterRemoteReactComponent("TableRow");
  createAndRegisterRemoteReactComponent("TableBody");
  createAndRegisterRemoteReactComponent("TableHeader");
  createAndRegisterRemoteReactComponent("TableHead");
  createAndRegisterRemoteReactComponent("NumberInput");
  createAndRegisterRemoteReactComponent("Box");
  createAndRegisterRemoteReactComponent("StepIndicator");
  createAndRegisterRemoteReactComponent("Accordion");
  createAndRegisterRemoteReactComponent("MultiSelect");
  const Flex = createAndRegisterRemoteReactComponent("Flex");
  createAndRegisterRemoteReactComponent("DateInput");
  createAndRegisterRemoteReactComponent("Checkbox");
  createAndRegisterRemoteReactComponent("RadioButton");
  createAndRegisterRemoteReactComponent("List");
  createAndRegisterRemoteReactComponent("Toggle");
  createAndRegisterRemoteCompoundReactComponent("Dropdown", {
    compoundComponentProperties: {
      /**
       * The `Dropdown.ButtonItem` component represents a single option within a `Dropdown` menu. Use this component as a child of the `Dropdown` component.
       *
       * **Links:**
       *
       * - {@link https://developers.hubspot.com/docs/reference/ui-components/standard-components/dropdown Docs}
       */
      ButtonItem: createAndRegisterRemoteReactComponent("DropdownButtonItem", {
        fragmentProps: ["overlay"]
      })
    }
  });
  createAndRegisterRemoteReactComponent("Panel");
  createAndRegisterRemoteReactComponent("PanelFooter");
  createAndRegisterRemoteReactComponent("PanelBody");
  createAndRegisterRemoteReactComponent("PanelSection");
  createAndRegisterRemoteReactComponent("StepperInput");
  createAndRegisterRemoteReactComponent("Modal");
  createAndRegisterRemoteReactComponent("ModalBody");
  createAndRegisterRemoteReactComponent("ModalFooter");
  const Icon = createAndRegisterRemoteReactComponent("Icon");
  createAndRegisterRemoteReactComponent("StatusTag");
  const LoadingButton = createAndRegisterRemoteReactComponent("LoadingButton", {
    fragmentProps: ["overlay"]
  });
  createAndRegisterRemoteReactComponent("BarChart");
  createAndRegisterRemoteReactComponent("LineChart");
  createAndRegisterRemoteReactComponent("Tabs");
  createAndRegisterRemoteReactComponent("Tab");
  createAndRegisterRemoteReactComponent("Illustration");
  const Tooltip = createAndRegisterRemoteReactComponent("Tooltip");
  createAndRegisterRemoteReactComponent("SearchInput");
  createAndRegisterRemoteReactComponent("TimeInput");
  createAndRegisterRemoteReactComponent("CurrencyInput");
  createAndRegisterRemoteReactComponent("Inline");
  createAndRegisterRemoteReactComponent("AutoGrid");
  createAndRegisterRemoteReactComponent("CrmPropertyList");
  createAndRegisterRemoteReactComponent("CrmAssociationTable");
  createAndRegisterRemoteReactComponent("CrmDataHighlight");
  createAndRegisterRemoteReactComponent("CrmReport");
  createAndRegisterRemoteReactComponent("CrmAssociationPivot");
  createAndRegisterRemoteReactComponent("CrmAssociationPropertyList");
  createAndRegisterRemoteReactComponent("CrmAssociationStageTracker");
  createAndRegisterRemoteReactComponent("CrmSimpleDeadline");
  createAndRegisterRemoteReactComponent("CrmStageTracker");
  createAndRegisterRemoteReactComponent("CrmStatistics");
  createAndRegisterRemoteReactComponent("CrmActionButton");
  createAndRegisterRemoteReactComponent("CrmActionLink");
  createAndRegisterRemoteReactComponent("CrmCardActions");
  createAndRegisterRemoteReactComponent("HeaderActions");
  createAndRegisterRemoteReactComponent("PrimaryHeaderActionButton", {
    fragmentProps: ["overlay"]
  });
  createAndRegisterRemoteReactComponent("SecondaryHeaderActionButton", {
    fragmentProps: ["overlay"]
  });
  createAndRegisterRemoteReactComponent("Iframe");
  createAndRegisterRemoteReactComponent("MediaObject", {
    fragmentProps: ["itemRight", "itemLeft"]
  });
  createAndRegisterRemoteReactComponent("Stack2");
  createAndRegisterRemoteReactComponent("Center");
  createAndRegisterRemoteReactComponent("Grid");
  createAndRegisterRemoteReactComponent("GridItem");
  createAndRegisterRemoteReactComponent("SettingsView");
  createAndRegisterRemoteReactComponent("ExpandableText");
  createAndRegisterRemoteReactComponent("Popover");
  createAndRegisterRemoteReactComponent("FileInput");
  const MocksContext = React2.createContext(null);
  MocksContext.Provider;
  function getErrorMessage(err) {
    if (err instanceof Error) return err.message;
    if (typeof err === "string") return err;
    try {
      return JSON.stringify(err);
    } catch {
      return String(err);
    }
  }
  hubspot.extend((api) => {
    const { context, actions } = api;
    return /* @__PURE__ */ React2.createElement(FeeSheetCard, { context, addAlert: actions == null ? void 0 : actions.addAlert });
  });
  const BACKEND_ENDPOINT = "https://fee-sheet-backend.onrender.com/api/fee-sheet";
  const EXCEL_ICON_URL = "https://50802810.fs1.hubspotusercontent-na1.net/hubfs/50802810/file.png";
  function buildBackendUrl(params) {
    const url = new URL(BACKEND_ENDPOINT);
    Object.entries(params).forEach(([k, v]) => {
      if (v) url.searchParams.set(k, v);
    });
    return url.toString();
  }
  async function callBackend(params) {
    const url = buildBackendUrl(params);
    const res = await hubspot.fetch(url, {
      method: "GET",
      timeout: 12e3
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Backend error ${res.status}: ${text}`);
    }
    return res.json();
  }
  function buildDotSvgDataUri(color) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10">
    <circle cx="5" cy="5" r="4" fill="${color}" stroke="${color}" stroke-width="2" />
  </svg>`;
    const encoded = encodeURIComponent(svg).replace(/'/g, "%27").replace(/"/g, "%22");
    return `data:image/svg+xml,${encoded}`;
  }
  function StatusTag({
    label,
    tone = "warning"
  }) {
    const stylesByTone = {
      warning: { dotColor: "#F5C26B" },
      muted: { dotColor: "#CBD5E1" },
      success: { dotColor: "#22C55E" },
      error: { dotColor: "#EF4444" }
    };
    const s = stylesByTone[tone] || stylesByTone.warning;
    const dotSrc = React2.useMemo(() => buildDotSvgDataUri(s.dotColor), [s.dotColor]);
    return /* @__PURE__ */ React2.createElement(Flex, { direction: "row", align: "baseline", gap: "xs" }, /* @__PURE__ */ React2.createElement(Image, { src: dotSrc, alt: "", width: 10 }), /* @__PURE__ */ React2.createElement(Text, { variant: "microcopy", format: { fontWeight: "bold" } }, label));
  }
  function FeeSheetCard({
    context,
    addAlert
  }) {
    var _a, _b, _c, _d, _e;
    const ctx = context;
    const [status, setStatus] = React2.useState("");
    const [isLoading, setIsLoading] = React2.useState(true);
    const [feeSheetUrl, setFeeSheetUrl] = React2.useState("");
    const [feeSheetFileName, setFeeSheetFileName] = React2.useState("");
    const [feeSheetCreatedBy, setFeeSheetCreatedBy] = React2.useState("");
    const [lastUpdatedAt, setLastUpdatedAt] = React2.useState("");
    const [spCreatedAt, setSpCreatedAt] = React2.useState("");
    const [spLastModifiedAt, setSpLastModifiedAt] = React2.useState("");
    const [lastSyncedAt, setLastSyncedAt] = React2.useState("");
    const [readyAt, setReadyAt] = React2.useState("");
    const [readyBy, setReadyBy] = React2.useState("");
    const [isTogglingReady, setIsTogglingReady] = React2.useState(false);
    const [isSyncingNow, setIsSyncingNow] = React2.useState(false);
    const [isDeleting, setIsDeleting] = React2.useState(false);
    const [proposalSentLocked, setProposalSentLocked] = React2.useState(false);
    const objectId = ((_a = ctx.crm) == null ? void 0 : _a.objectId) || ((_b = ctx.crm) == null ? void 0 : _b.recordId) || ctx.objectId || "";
    const createdByForRequest = React2.useMemo(() => {
      var _a2, _b2, _c2;
      const first = ((_a2 = ctx.user) == null ? void 0 : _a2.firstName) || "";
      const last = ((_b2 = ctx.user) == null ? void 0 : _b2.lastName) || "";
      return `${first} ${last}`.trim() || ((_c2 = ctx.user) == null ? void 0 : _c2.email) || "Unknown user";
    }, [(_c = ctx.user) == null ? void 0 : _c.firstName, (_d = ctx.user) == null ? void 0 : _d.lastName, (_e = ctx.user) == null ? void 0 : _e.email]);
    const canOpen = feeSheetUrl.startsWith("http");
    const openFeeSheet = async () => {
      var _a2;
      if (!canOpen) return;
      try {
        const hs = hubspot;
        if ((_a2 = hs.actions) == null ? void 0 : _a2.openUrl) {
          await hs.actions.openUrl({ url: feeSheetUrl });
          return;
        }
      } catch {
      }
      try {
        if (typeof window !== "undefined" && (window == null ? void 0 : window.open)) {
          window.open(feeSheetUrl, "_blank", "noopener,noreferrer");
        }
      } catch {
        setStatus("Could not open file from this card environment.");
      }
    };
    const alert = (type, message, title) => {
      if (addAlert) addAlert({ type, message, title });
    };
    const relativeTime = (iso) => {
      if (!iso) return "—";
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return iso;
      const mins = Math.floor((Date.now() - d.getTime()) / 6e4);
      if (mins < 2) return "just now";
      if (mins < 60) return `${mins} minutes ago`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours} hours ago`;
      const days = Math.floor(hours / 24);
      return days === 1 ? "yesterday" : `${days} days ago`;
    };
    const computeStatus = () => {
      if (!feeSheetUrl) return null;
      if (proposalSentLocked) {
        return { tone: "success", label: "Ready for proposal" };
      }
      const c = new Date(spCreatedAt);
      const m = new Date(spLastModifiedAt);
      if (spCreatedAt && spLastModifiedAt && !Number.isNaN(c.getTime()) && !Number.isNaN(m.getTime())) {
        const diff = Math.abs(m.getTime() - c.getTime());
        return diff <= 6e4 ? { tone: "error", label: "Not started" } : { tone: "warning", label: "In progress" };
      }
      return { tone: "warning", label: "In progress" };
    };
    const statusDisplay = computeStatus();
    async function loadFeeSheetMeta() {
      const body = await callBackend({
        action: "get",
        objectId: String(objectId)
      });
      setFeeSheetUrl((body == null ? void 0 : body.feeSheetUrl) || "");
      setFeeSheetFileName((body == null ? void 0 : body.feeSheetFileName) || "");
      setFeeSheetCreatedBy((body == null ? void 0 : body.feeSheetCreatedBy) || "");
      setLastUpdatedAt((body == null ? void 0 : body.lastUpdatedAt) || "");
      setSpCreatedAt((body == null ? void 0 : body.spCreatedAt) || "");
      setSpLastModifiedAt((body == null ? void 0 : body.spLastModifiedAt) || "");
      setLastSyncedAt((body == null ? void 0 : body.feeSheetLastSyncedAt) || "");
      const serverReadyAt = (body == null ? void 0 : body.fee_sheet_ready_at) || (body == null ? void 0 : body.feeSheetReadyAt) || (body == null ? void 0 : body.readyAt) || "";
      const serverReadyBy = (body == null ? void 0 : body.fee_sheet_ready_by) || (body == null ? void 0 : body.feeSheetReadyBy) || (body == null ? void 0 : body.readyBy) || "";
      setReadyAt(serverReadyAt);
      setReadyBy(serverReadyBy);
      const backendReady = Boolean(body == null ? void 0 : body.readyForProposal);
      setProposalSentLocked(backendReady);
    }
    React2.useEffect(() => {
      (async () => {
        try {
          await loadFeeSheetMeta();
        } catch (e) {
          setStatus(`Load error: ${getErrorMessage(e)}`);
        } finally {
          setIsLoading(false);
        }
      })();
    }, []);
    React2.useEffect(() => {
      if (!canOpen) return;
      if (isLoading) return;
      const POLL_MS = 2e4;
      const id = setInterval(() => {
        if (isTogglingReady || isSyncingNow || isDeleting) return;
        loadFeeSheetMeta().catch(() => {
        });
      }, POLL_MS);
      return () => clearInterval(id);
    }, [canOpen, isLoading, isTogglingReady, isSyncingNow, isDeleting, objectId]);
    async function onCreate() {
      try {
        setIsLoading(true);
        setStatus("");
        const body = await callBackend({
          action: "create",
          objectId: String(objectId),
          createdBy: createdByForRequest
        });
        alert("success", (body == null ? void 0 : body.message) || "Fee sheet created.", "Created");
        setStatus("");
        await loadFeeSheetMeta();
      } catch (e) {
        const msg = getErrorMessage(e);
        alert("danger", msg, "Create failed");
        setStatus(`Error: ${msg}`);
      } finally {
        setIsLoading(false);
      }
    }
    async function onSyncNow() {
      if (isSyncingNow || isTogglingReady || isLoading || isDeleting) return;
      try {
        setIsSyncingNow(true);
        setStatus("");
        const body = await callBackend({
          action: "refresh",
          objectId: String(objectId)
        });
        if (body == null ? void 0 : body.feeSheetLastSyncedAt) setLastSyncedAt(body.feeSheetLastSyncedAt);
        alert("success", (body == null ? void 0 : body.message) || "Synced successfully.", "Sync complete");
        setStatus("");
        await loadFeeSheetMeta();
      } catch (e) {
        const msg = getErrorMessage(e);
        alert("danger", msg, "Sync failed");
        setStatus(`Error: ${msg}`);
      } finally {
        setIsSyncingNow(false);
      }
    }
    async function onSendProposal() {
      if (isTogglingReady || proposalSentLocked || isDeleting) return;
      try {
        setIsTogglingReady(true);
        setStatus("");
        const body = await callBackend({
          action: "set-ready",
          objectId: String(objectId),
          ready: "true",
          updatedBy: createdByForRequest
        });
        alert("success", (body == null ? void 0 : body.message) || "Marked ready for proposal.", "Updated");
        setProposalSentLocked(true);
        await loadFeeSheetMeta();
      } catch (e) {
        const msg = getErrorMessage(e);
        alert("danger", msg, "Update failed");
        setStatus(`Error: ${msg}`);
      } finally {
        setIsTogglingReady(false);
      }
    }
    async function onGoBackToEditing() {
      if (isTogglingReady || isDeleting) return;
      try {
        setIsTogglingReady(true);
        setStatus("");
        await callBackend({
          action: "set-ready",
          objectId: String(objectId),
          ready: "false",
          updatedBy: createdByForRequest
        });
        alert("success", "Reopened for edits.", "Updated");
        setProposalSentLocked(false);
        await loadFeeSheetMeta();
      } catch (e) {
        const msg = getErrorMessage(e);
        alert("danger", msg, "Update failed");
        setStatus(`Error: ${msg}`);
        setProposalSentLocked(true);
      } finally {
        setIsTogglingReady(false);
      }
    }
    async function onDeleteFeeSheet() {
      if (isDeleting || isLoading || isSyncingNow || isTogglingReady) return;
      try {
        setIsDeleting(true);
        setStatus("");
        const body = await callBackend({
          action: "detach",
          // backend must support this
          objectId: String(objectId),
          updatedBy: createdByForRequest
        });
        alert("success", (body == null ? void 0 : body.message) || "Fee sheet detached.", "Deleted");
        setProposalSentLocked(false);
        await loadFeeSheetMeta();
      } catch (e) {
        const msg = getErrorMessage(e);
        alert("danger", msg, "Delete failed");
        setStatus(`Error: ${msg}`);
      } finally {
        setIsDeleting(false);
      }
    }
    return /* @__PURE__ */ React2.createElement(Flex, { direction: "column", gap: "flush" }, isLoading ? /* @__PURE__ */ React2.createElement(Text, { variant: "bodytext" }, "Loading fee sheet…") : !canOpen ? /* @__PURE__ */ React2.createElement(Button, { variant: "primary", onClick: onCreate }, "Create Fee Sheet") : /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement(Flex, { direction: "column", gap: "xs" }, /* @__PURE__ */ React2.createElement(Flex, { direction: "column", gap: "flush", justify: "start" }, /* @__PURE__ */ React2.createElement(Flex, { direction: "row", align: "center", justify: "start", gap: "flush" }, statusDisplay && /* @__PURE__ */ React2.createElement(
      StatusTag,
      {
        label: statusDisplay.label,
        tone: statusDisplay.tone
      }
    ), /* @__PURE__ */ React2.createElement(
      Button,
      {
        variant: "transparent",
        size: "md",
        onClick: onDeleteFeeSheet,
        loading: isDeleting,
        disabled: isTogglingReady || isSyncingNow || isLoading,
        overlay: /* @__PURE__ */ React2.createElement(Tooltip, { placement: "top" }, "Delete")
      },
      /* @__PURE__ */ React2.createElement(Icon, { name: "delete" })
    ), proposalSentLocked && /* @__PURE__ */ React2.createElement(
      Button,
      {
        variant: "transparent",
        size: "md",
        onClick: onGoBackToEditing,
        disabled: isTogglingReady || isSyncingNow || isDeleting,
        overlay: /* @__PURE__ */ React2.createElement(Tooltip, { placement: "top" }, "Reopen for edits")
      },
      /* @__PURE__ */ React2.createElement(Icon, { name: "edit" })
    )), proposalSentLocked ? /* @__PURE__ */ React2.createElement(Text, { variant: "microcopy" }, "Approved:", " ", /* @__PURE__ */ React2.createElement(Text, { inline: true, variant: "microcopy", format: { italic: true } }, relativeTime(readyAt || lastUpdatedAt)), " ", "by", " ", /* @__PURE__ */ React2.createElement(Text, { inline: true, variant: "microcopy", format: { italic: true } }, readyBy || "—")) : /* @__PURE__ */ React2.createElement(React2.Fragment, null)), /* @__PURE__ */ React2.createElement(Tile, { compact: true }, /* @__PURE__ */ React2.createElement(Flex, { direction: "row", align: "baseline", gap: "sm", justify: "start" }, /* @__PURE__ */ React2.createElement(Image, { src: EXCEL_ICON_URL, alt: "Excel", width: 34 }), /* @__PURE__ */ React2.createElement(
      Link,
      {
        variant: "primary",
        href: { url: feeSheetUrl, external: true },
        onClick: openFeeSheet
      },
      feeSheetFileName || "Fee Sheet"
    ))), /* @__PURE__ */ React2.createElement(Flex, { direction: "column", gap: "xs" }, /* @__PURE__ */ React2.createElement(ButtonRow, null, !proposalSentLocked ? /* @__PURE__ */ React2.createElement(
      LoadingButton,
      {
        variant: "primary",
        size: "md",
        onClick: onSendProposal,
        loading: isTogglingReady,
        disabled: isLoading || proposalSentLocked || isSyncingNow || isDeleting,
        resultIconName: "success"
      },
      /* @__PURE__ */ React2.createElement(Icon, { name: "notification" }),
      "Approve"
    ) : /* @__PURE__ */ React2.createElement(React2.Fragment, null)), proposalSentLocked ? /* @__PURE__ */ React2.createElement(Flex, { direction: "column", gap: "xs" }, /* @__PURE__ */ React2.createElement(Flex, { direction: "row", align: "center", justify: "start", gap: "xs" }, /* @__PURE__ */ React2.createElement(
      LoadingButton,
      {
        variant: "secondary",
        size: "xs",
        onClick: onSyncNow,
        loading: isSyncingNow,
        disabled: isTogglingReady || isLoading || isDeleting,
        resultIconName: "success",
        overlay: /* @__PURE__ */ React2.createElement(Tooltip, { placement: "top" }, "Resync")
      },
      /* @__PURE__ */ React2.createElement(Icon, { name: "refresh" })
    ), /* @__PURE__ */ React2.createElement(Text, { variant: "microcopy" }, "Last synced: ", lastSyncedAt ? relativeTime(lastSyncedAt) : "—"))) : /* @__PURE__ */ React2.createElement(Flex, { direction: "row", align: "baseline", gap: "xs" }, /* @__PURE__ */ React2.createElement(Text, { variant: "microcopy" }, "Posts to #proposals"))))), status && /* @__PURE__ */ React2.createElement(Text, { variant: "bodytext" }, status));
  }
  return FeeSheetCard;
})(React, RemoteUI);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTmV3Q2FyZC5qcyIsInNvdXJjZXMiOlsiLi4vY2FyZHMvbm9kZV9tb2R1bGVzL0BodWJzcG90L3VpLWV4dGVuc2lvbnMvZGlzdC9pbnRlcm5hbC9nbG9iYWwtdXRpbHMuanMiLCIuLi9jYXJkcy9ub2RlX21vZHVsZXMvQGh1YnNwb3QvdWktZXh0ZW5zaW9ucy9kaXN0L2h1YnNwb3QuanMiLCIuLi9jYXJkcy9ub2RlX21vZHVsZXMvcmVhY3QvY2pzL3JlYWN0LWpzeC1ydW50aW1lLmRldmVsb3BtZW50LmpzIiwiLi4vY2FyZHMvbm9kZV9tb2R1bGVzL3JlYWN0L2pzeC1ydW50aW1lLmpzIiwiLi4vY2FyZHMvbm9kZV9tb2R1bGVzL0BodWJzcG90L3VpLWV4dGVuc2lvbnMvZGlzdC9zaGFyZWQvdXRpbHMvcmVtb3RlLWNvbXBvbmVudC1yZWdpc3RyeS5qcyIsIi4uL2NhcmRzL25vZGVfbW9kdWxlcy9AaHVic3BvdC91aS1leHRlbnNpb25zL2Rpc3Qvc2hhcmVkL3JlbW90ZUNvbXBvbmVudHMuanMiLCIuLi9jYXJkcy9ub2RlX21vZHVsZXMvQGh1YnNwb3QvdWktZXh0ZW5zaW9ucy9kaXN0L2ludGVybmFsL2hvb2stdXRpbHMuanMiLCIuLi9jYXJkcy9OZXdDYXJkLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENoZWNrcyBpZiB0aGUgY3VycmVudCBlbnZpcm9ubWVudCBpcyBhIEh1YlNwb3QgZXh0ZW5zaW9uIHdvcmtlci5cbiAqIEByZXR1cm5zIFRydWUgaWYgdGhlIGN1cnJlbnQgZW52aXJvbm1lbnQgaXMgYSBIdWJTcG90IGV4dGVuc2lvbiB3b3JrZXIuXG4gKi9cbmNvbnN0IGlzUnVubmluZ0luV29ya2VyID0gKCkgPT4gdHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnICYmXG4gICAgc2VsZi5fX0hVQlNQT1RfRVhURU5TSU9OX1dPUktFUl9fID09PSB0cnVlO1xuLyoqXG4gKiBBIGZha2Ugd29ya2VyIGdsb2JhbHMgb2JqZWN0IGZvciB1c2UgaW4gdGVzdCBlbnZpcm9ubWVudHMuXG4gKi9cbmNvbnN0IGZha2VXb3JrZXJHbG9iYWxzID0ge1xuICAgIGxvZ2dlcjoge1xuICAgICAgICBkZWJ1ZzogKGRhdGEpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICB9LFxuICAgICAgICBpbmZvOiAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKGRhdGEpO1xuICAgICAgICB9LFxuICAgICAgICB3YXJuOiAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGRhdGEpO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogKGRhdGEpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZGF0YSk7XG4gICAgICAgIH0sXG4gICAgfSxcbiAgICBleHRlbmRfVjI6ICgpID0+IHtcbiAgICAgICAgLy8gTm8tb3AgaW4gdGVzdCBlbnZpcm9ubWVudFxuICAgIH0sXG4gICAgLy8gQHRzLWV4cGVjdC1lcnJvciB3ZSBhcmUgbm90IHVzaW5nIHRoZSB3b3JrZXIgZW5kcG9pbnQgaW4gdGVzdHMgZW52LlxuICAgIF9fdXNlRXh0ZW5zaW9uQ29udGV4dDogKCkgPT4ge1xuICAgICAgICAvLyBOby1vcCBpbiB0ZXN0IGVudmlyb25tZW50XG4gICAgfSxcbn07XG4vKipcbiAqIEdldHMgdGhlIHdvcmtlciBnbG9iYWxzIG9iamVjdCBmb3IgdGhlIGN1cnJlbnQgZW52aXJvbm1lbnQuXG4gKiBAcmV0dXJucyBUaGUgd29ya2VyIGdsb2JhbHMgb2JqZWN0LlxuICovXG5leHBvcnQgY29uc3QgZ2V0V29ya2VyR2xvYmFscyA9ICgpID0+IHtcbiAgICByZXR1cm4gaXNSdW5uaW5nSW5Xb3JrZXIoKVxuICAgICAgICA/IHNlbGZcbiAgICAgICAgOiBmYWtlV29ya2VyR2xvYmFscztcbn07XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBodWJzcG90LWRldi9uby1jb25mdXNpbmctYnJvd3Nlci1nbG9iYWxzICovXG5pbXBvcnQgeyBnZXRXb3JrZXJHbG9iYWxzIH0gZnJvbSBcIi4vaW50ZXJuYWwvZ2xvYmFsLXV0aWxzLmpzXCI7XG5jb25zdCBleHRlbmRfVjIgPSBnZXRXb3JrZXJHbG9iYWxzKCkuZXh0ZW5kX1YyO1xuZXhwb3J0IGZ1bmN0aW9uIHNlcnZlcmxlc3MobmFtZSwgb3B0aW9ucykge1xuICAgIHJldHVybiBzZWxmLnNlcnZlcmxlc3MobmFtZSwgb3B0aW9ucyk7XG59XG5leHBvcnQgZnVuY3Rpb24gZmV0Y2godXJsLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIHNlbGYuaHNGZXRjaCh1cmwsIG9wdGlvbnMpO1xufVxuZXhwb3J0IGNvbnN0IGh1YnNwb3QgPSB7XG4gICAgZXh0ZW5kOiBleHRlbmRfVjIsXG4gICAgc2VydmVybGVzcyxcbiAgICBmZXRjaCxcbn07XG4iLCIvKipcbiAqIEBsaWNlbnNlIFJlYWN0XG4gKiByZWFjdC1qc3gtcnVudGltZS5kZXZlbG9wbWVudC5qc1xuICpcbiAqIENvcHlyaWdodCAoYykgRmFjZWJvb2ssIEluYy4gYW5kIGl0cyBhZmZpbGlhdGVzLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikge1xuICAoZnVuY3Rpb24oKSB7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbi8vIEFUVEVOVElPTlxuLy8gV2hlbiBhZGRpbmcgbmV3IHN5bWJvbHMgdG8gdGhpcyBmaWxlLFxuLy8gUGxlYXNlIGNvbnNpZGVyIGFsc28gYWRkaW5nIHRvICdyZWFjdC1kZXZ0b29scy1zaGFyZWQvc3JjL2JhY2tlbmQvUmVhY3RTeW1ib2xzJ1xuLy8gVGhlIFN5bWJvbCB1c2VkIHRvIHRhZyB0aGUgUmVhY3RFbGVtZW50LWxpa2UgdHlwZXMuXG52YXIgUkVBQ1RfRUxFTUVOVF9UWVBFID0gU3ltYm9sLmZvcigncmVhY3QuZWxlbWVudCcpO1xudmFyIFJFQUNUX1BPUlRBTF9UWVBFID0gU3ltYm9sLmZvcigncmVhY3QucG9ydGFsJyk7XG52YXIgUkVBQ1RfRlJBR01FTlRfVFlQRSA9IFN5bWJvbC5mb3IoJ3JlYWN0LmZyYWdtZW50Jyk7XG52YXIgUkVBQ1RfU1RSSUNUX01PREVfVFlQRSA9IFN5bWJvbC5mb3IoJ3JlYWN0LnN0cmljdF9tb2RlJyk7XG52YXIgUkVBQ1RfUFJPRklMRVJfVFlQRSA9IFN5bWJvbC5mb3IoJ3JlYWN0LnByb2ZpbGVyJyk7XG52YXIgUkVBQ1RfUFJPVklERVJfVFlQRSA9IFN5bWJvbC5mb3IoJ3JlYWN0LnByb3ZpZGVyJyk7XG52YXIgUkVBQ1RfQ09OVEVYVF9UWVBFID0gU3ltYm9sLmZvcigncmVhY3QuY29udGV4dCcpO1xudmFyIFJFQUNUX0ZPUldBUkRfUkVGX1RZUEUgPSBTeW1ib2wuZm9yKCdyZWFjdC5mb3J3YXJkX3JlZicpO1xudmFyIFJFQUNUX1NVU1BFTlNFX1RZUEUgPSBTeW1ib2wuZm9yKCdyZWFjdC5zdXNwZW5zZScpO1xudmFyIFJFQUNUX1NVU1BFTlNFX0xJU1RfVFlQRSA9IFN5bWJvbC5mb3IoJ3JlYWN0LnN1c3BlbnNlX2xpc3QnKTtcbnZhciBSRUFDVF9NRU1PX1RZUEUgPSBTeW1ib2wuZm9yKCdyZWFjdC5tZW1vJyk7XG52YXIgUkVBQ1RfTEFaWV9UWVBFID0gU3ltYm9sLmZvcigncmVhY3QubGF6eScpO1xudmFyIFJFQUNUX09GRlNDUkVFTl9UWVBFID0gU3ltYm9sLmZvcigncmVhY3Qub2Zmc2NyZWVuJyk7XG52YXIgTUFZQkVfSVRFUkFUT1JfU1lNQk9MID0gU3ltYm9sLml0ZXJhdG9yO1xudmFyIEZBVVhfSVRFUkFUT1JfU1lNQk9MID0gJ0BAaXRlcmF0b3InO1xuZnVuY3Rpb24gZ2V0SXRlcmF0b3JGbihtYXliZUl0ZXJhYmxlKSB7XG4gIGlmIChtYXliZUl0ZXJhYmxlID09PSBudWxsIHx8IHR5cGVvZiBtYXliZUl0ZXJhYmxlICE9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdmFyIG1heWJlSXRlcmF0b3IgPSBNQVlCRV9JVEVSQVRPUl9TWU1CT0wgJiYgbWF5YmVJdGVyYWJsZVtNQVlCRV9JVEVSQVRPUl9TWU1CT0xdIHx8IG1heWJlSXRlcmFibGVbRkFVWF9JVEVSQVRPUl9TWU1CT0xdO1xuXG4gIGlmICh0eXBlb2YgbWF5YmVJdGVyYXRvciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBtYXliZUl0ZXJhdG9yO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbnZhciBSZWFjdFNoYXJlZEludGVybmFscyA9IFJlYWN0Ll9fU0VDUkVUX0lOVEVSTkFMU19ET19OT1RfVVNFX09SX1lPVV9XSUxMX0JFX0ZJUkVEO1xuXG5mdW5jdGlvbiBlcnJvcihmb3JtYXQpIHtcbiAge1xuICAgIHtcbiAgICAgIGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuMiA+IDEgPyBfbGVuMiAtIDEgOiAwKSwgX2tleTIgPSAxOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XG4gICAgICAgIGFyZ3NbX2tleTIgLSAxXSA9IGFyZ3VtZW50c1tfa2V5Ml07XG4gICAgICB9XG5cbiAgICAgIHByaW50V2FybmluZygnZXJyb3InLCBmb3JtYXQsIGFyZ3MpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBwcmludFdhcm5pbmcobGV2ZWwsIGZvcm1hdCwgYXJncykge1xuICAvLyBXaGVuIGNoYW5naW5nIHRoaXMgbG9naWMsIHlvdSBtaWdodCB3YW50IHRvIGFsc29cbiAgLy8gdXBkYXRlIGNvbnNvbGVXaXRoU3RhY2tEZXYud3d3LmpzIGFzIHdlbGwuXG4gIHtcbiAgICB2YXIgUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZSA9IFJlYWN0U2hhcmVkSW50ZXJuYWxzLlJlYWN0RGVidWdDdXJyZW50RnJhbWU7XG4gICAgdmFyIHN0YWNrID0gUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZS5nZXRTdGFja0FkZGVuZHVtKCk7XG5cbiAgICBpZiAoc3RhY2sgIT09ICcnKSB7XG4gICAgICBmb3JtYXQgKz0gJyVzJztcbiAgICAgIGFyZ3MgPSBhcmdzLmNvbmNhdChbc3RhY2tdKTtcbiAgICB9IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1pbnRlcm5hbC9zYWZlLXN0cmluZy1jb2VyY2lvblxuXG5cbiAgICB2YXIgYXJnc1dpdGhGb3JtYXQgPSBhcmdzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgcmV0dXJuIFN0cmluZyhpdGVtKTtcbiAgICB9KTsgLy8gQ2FyZWZ1bDogUk4gY3VycmVudGx5IGRlcGVuZHMgb24gdGhpcyBwcmVmaXhcblxuICAgIGFyZ3NXaXRoRm9ybWF0LnVuc2hpZnQoJ1dhcm5pbmc6ICcgKyBmb3JtYXQpOyAvLyBXZSBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBzcHJlYWQgKG9yIC5hcHBseSkgZGlyZWN0bHkgYmVjYXVzZSBpdFxuICAgIC8vIGJyZWFrcyBJRTk6IGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9pc3N1ZXMvMTM2MTBcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3QtaW50ZXJuYWwvbm8tcHJvZHVjdGlvbi1sb2dnaW5nXG5cbiAgICBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHkuY2FsbChjb25zb2xlW2xldmVsXSwgY29uc29sZSwgYXJnc1dpdGhGb3JtYXQpO1xuICB9XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBlbmFibGVTY29wZUFQSSA9IGZhbHNlOyAvLyBFeHBlcmltZW50YWwgQ3JlYXRlIEV2ZW50IEhhbmRsZSBBUEkuXG52YXIgZW5hYmxlQ2FjaGVFbGVtZW50ID0gZmFsc2U7XG52YXIgZW5hYmxlVHJhbnNpdGlvblRyYWNpbmcgPSBmYWxzZTsgLy8gTm8ga25vd24gYnVncywgYnV0IG5lZWRzIHBlcmZvcm1hbmNlIHRlc3RpbmdcblxudmFyIGVuYWJsZUxlZ2FjeUhpZGRlbiA9IGZhbHNlOyAvLyBFbmFibGVzIHVuc3RhYmxlX2F2b2lkVGhpc0ZhbGxiYWNrIGZlYXR1cmUgaW4gRmliZXJcbi8vIHN0dWZmLiBJbnRlbmRlZCB0byBlbmFibGUgUmVhY3QgY29yZSBtZW1iZXJzIHRvIG1vcmUgZWFzaWx5IGRlYnVnIHNjaGVkdWxpbmdcbi8vIGlzc3VlcyBpbiBERVYgYnVpbGRzLlxuXG52YXIgZW5hYmxlRGVidWdUcmFjaW5nID0gZmFsc2U7IC8vIFRyYWNrIHdoaWNoIEZpYmVyKHMpIHNjaGVkdWxlIHJlbmRlciB3b3JrLlxuXG52YXIgUkVBQ1RfTU9EVUxFX1JFRkVSRU5DRTtcblxue1xuICBSRUFDVF9NT0RVTEVfUkVGRVJFTkNFID0gU3ltYm9sLmZvcigncmVhY3QubW9kdWxlLnJlZmVyZW5jZScpO1xufVxuXG5mdW5jdGlvbiBpc1ZhbGlkRWxlbWVudFR5cGUodHlwZSkge1xuICBpZiAodHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gLy8gTm90ZTogdHlwZW9mIG1pZ2h0IGJlIG90aGVyIHRoYW4gJ3N5bWJvbCcgb3IgJ251bWJlcicgKGUuZy4gaWYgaXQncyBhIHBvbHlmaWxsKS5cblxuXG4gIGlmICh0eXBlID09PSBSRUFDVF9GUkFHTUVOVF9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1BST0ZJTEVSX1RZUEUgfHwgZW5hYmxlRGVidWdUcmFjaW5nICB8fCB0eXBlID09PSBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1NVU1BFTlNFX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfU1VTUEVOU0VfTElTVF9UWVBFIHx8IGVuYWJsZUxlZ2FjeUhpZGRlbiAgfHwgdHlwZSA9PT0gUkVBQ1RfT0ZGU0NSRUVOX1RZUEUgfHwgZW5hYmxlU2NvcGVBUEkgIHx8IGVuYWJsZUNhY2hlRWxlbWVudCAgfHwgZW5hYmxlVHJhbnNpdGlvblRyYWNpbmcgKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAodHlwZW9mIHR5cGUgPT09ICdvYmplY3QnICYmIHR5cGUgIT09IG51bGwpIHtcbiAgICBpZiAodHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfTEFaWV9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX01FTU9fVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9QUk9WSURFUl9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0NPTlRFWFRfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFIHx8IC8vIFRoaXMgbmVlZHMgdG8gaW5jbHVkZSBhbGwgcG9zc2libGUgbW9kdWxlIHJlZmVyZW5jZSBvYmplY3RcbiAgICAvLyB0eXBlcyBzdXBwb3J0ZWQgYnkgYW55IEZsaWdodCBjb25maWd1cmF0aW9uIGFueXdoZXJlIHNpbmNlXG4gICAgLy8gd2UgZG9uJ3Qga25vdyB3aGljaCBGbGlnaHQgYnVpbGQgdGhpcyB3aWxsIGVuZCB1cCBiZWluZyB1c2VkXG4gICAgLy8gd2l0aC5cbiAgICB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9NT0RVTEVfUkVGRVJFTkNFIHx8IHR5cGUuZ2V0TW9kdWxlSWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBnZXRXcmFwcGVkTmFtZShvdXRlclR5cGUsIGlubmVyVHlwZSwgd3JhcHBlck5hbWUpIHtcbiAgdmFyIGRpc3BsYXlOYW1lID0gb3V0ZXJUeXBlLmRpc3BsYXlOYW1lO1xuXG4gIGlmIChkaXNwbGF5TmFtZSkge1xuICAgIHJldHVybiBkaXNwbGF5TmFtZTtcbiAgfVxuXG4gIHZhciBmdW5jdGlvbk5hbWUgPSBpbm5lclR5cGUuZGlzcGxheU5hbWUgfHwgaW5uZXJUeXBlLm5hbWUgfHwgJyc7XG4gIHJldHVybiBmdW5jdGlvbk5hbWUgIT09ICcnID8gd3JhcHBlck5hbWUgKyBcIihcIiArIGZ1bmN0aW9uTmFtZSArIFwiKVwiIDogd3JhcHBlck5hbWU7XG59IC8vIEtlZXAgaW4gc3luYyB3aXRoIHJlYWN0LXJlY29uY2lsZXIvZ2V0Q29tcG9uZW50TmFtZUZyb21GaWJlclxuXG5cbmZ1bmN0aW9uIGdldENvbnRleHROYW1lKHR5cGUpIHtcbiAgcmV0dXJuIHR5cGUuZGlzcGxheU5hbWUgfHwgJ0NvbnRleHQnO1xufSAvLyBOb3RlIHRoYXQgdGhlIHJlY29uY2lsZXIgcGFja2FnZSBzaG91bGQgZ2VuZXJhbGx5IHByZWZlciB0byB1c2UgZ2V0Q29tcG9uZW50TmFtZUZyb21GaWJlcigpIGluc3RlYWQuXG5cblxuZnVuY3Rpb24gZ2V0Q29tcG9uZW50TmFtZUZyb21UeXBlKHR5cGUpIHtcbiAgaWYgKHR5cGUgPT0gbnVsbCkge1xuICAgIC8vIEhvc3Qgcm9vdCwgdGV4dCBub2RlIG9yIGp1c3QgaW52YWxpZCB0eXBlLlxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAge1xuICAgIGlmICh0eXBlb2YgdHlwZS50YWcgPT09ICdudW1iZXInKSB7XG4gICAgICBlcnJvcignUmVjZWl2ZWQgYW4gdW5leHBlY3RlZCBvYmplY3QgaW4gZ2V0Q29tcG9uZW50TmFtZUZyb21UeXBlKCkuICcgKyAnVGhpcyBpcyBsaWtlbHkgYSBidWcgaW4gUmVhY3QuIFBsZWFzZSBmaWxlIGFuIGlzc3VlLicpO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiB0eXBlLmRpc3BsYXlOYW1lIHx8IHR5cGUubmFtZSB8fCBudWxsO1xuICB9XG5cbiAgaWYgKHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB0eXBlO1xuICB9XG5cbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSBSRUFDVF9GUkFHTUVOVF9UWVBFOlxuICAgICAgcmV0dXJuICdGcmFnbWVudCc7XG5cbiAgICBjYXNlIFJFQUNUX1BPUlRBTF9UWVBFOlxuICAgICAgcmV0dXJuICdQb3J0YWwnO1xuXG4gICAgY2FzZSBSRUFDVF9QUk9GSUxFUl9UWVBFOlxuICAgICAgcmV0dXJuICdQcm9maWxlcic7XG5cbiAgICBjYXNlIFJFQUNUX1NUUklDVF9NT0RFX1RZUEU6XG4gICAgICByZXR1cm4gJ1N0cmljdE1vZGUnO1xuXG4gICAgY2FzZSBSRUFDVF9TVVNQRU5TRV9UWVBFOlxuICAgICAgcmV0dXJuICdTdXNwZW5zZSc7XG5cbiAgICBjYXNlIFJFQUNUX1NVU1BFTlNFX0xJU1RfVFlQRTpcbiAgICAgIHJldHVybiAnU3VzcGVuc2VMaXN0JztcblxuICB9XG5cbiAgaWYgKHR5cGVvZiB0eXBlID09PSAnb2JqZWN0Jykge1xuICAgIHN3aXRjaCAodHlwZS4kJHR5cGVvZikge1xuICAgICAgY2FzZSBSRUFDVF9DT05URVhUX1RZUEU6XG4gICAgICAgIHZhciBjb250ZXh0ID0gdHlwZTtcbiAgICAgICAgcmV0dXJuIGdldENvbnRleHROYW1lKGNvbnRleHQpICsgJy5Db25zdW1lcic7XG5cbiAgICAgIGNhc2UgUkVBQ1RfUFJPVklERVJfVFlQRTpcbiAgICAgICAgdmFyIHByb3ZpZGVyID0gdHlwZTtcbiAgICAgICAgcmV0dXJuIGdldENvbnRleHROYW1lKHByb3ZpZGVyLl9jb250ZXh0KSArICcuUHJvdmlkZXInO1xuXG4gICAgICBjYXNlIFJFQUNUX0ZPUldBUkRfUkVGX1RZUEU6XG4gICAgICAgIHJldHVybiBnZXRXcmFwcGVkTmFtZSh0eXBlLCB0eXBlLnJlbmRlciwgJ0ZvcndhcmRSZWYnKTtcblxuICAgICAgY2FzZSBSRUFDVF9NRU1PX1RZUEU6XG4gICAgICAgIHZhciBvdXRlck5hbWUgPSB0eXBlLmRpc3BsYXlOYW1lIHx8IG51bGw7XG5cbiAgICAgICAgaWYgKG91dGVyTmFtZSAhPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBvdXRlck5hbWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZ2V0Q29tcG9uZW50TmFtZUZyb21UeXBlKHR5cGUudHlwZSkgfHwgJ01lbW8nO1xuXG4gICAgICBjYXNlIFJFQUNUX0xBWllfVFlQRTpcbiAgICAgICAge1xuICAgICAgICAgIHZhciBsYXp5Q29tcG9uZW50ID0gdHlwZTtcbiAgICAgICAgICB2YXIgcGF5bG9hZCA9IGxhenlDb21wb25lbnQuX3BheWxvYWQ7XG4gICAgICAgICAgdmFyIGluaXQgPSBsYXp5Q29tcG9uZW50Ll9pbml0O1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBnZXRDb21wb25lbnROYW1lRnJvbVR5cGUoaW5pdChwYXlsb2FkKSk7XG4gICAgICAgICAgfSBjYXRjaCAoeCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1mYWxsdGhyb3VnaFxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG52YXIgYXNzaWduID0gT2JqZWN0LmFzc2lnbjtcblxuLy8gSGVscGVycyB0byBwYXRjaCBjb25zb2xlLmxvZ3MgdG8gYXZvaWQgbG9nZ2luZyBkdXJpbmcgc2lkZS1lZmZlY3QgZnJlZVxuLy8gcmVwbGF5aW5nIG9uIHJlbmRlciBmdW5jdGlvbi4gVGhpcyBjdXJyZW50bHkgb25seSBwYXRjaGVzIHRoZSBvYmplY3Rcbi8vIGxhemlseSB3aGljaCB3b24ndCBjb3ZlciBpZiB0aGUgbG9nIGZ1bmN0aW9uIHdhcyBleHRyYWN0ZWQgZWFnZXJseS5cbi8vIFdlIGNvdWxkIGFsc28gZWFnZXJseSBwYXRjaCB0aGUgbWV0aG9kLlxudmFyIGRpc2FibGVkRGVwdGggPSAwO1xudmFyIHByZXZMb2c7XG52YXIgcHJldkluZm87XG52YXIgcHJldldhcm47XG52YXIgcHJldkVycm9yO1xudmFyIHByZXZHcm91cDtcbnZhciBwcmV2R3JvdXBDb2xsYXBzZWQ7XG52YXIgcHJldkdyb3VwRW5kO1xuXG5mdW5jdGlvbiBkaXNhYmxlZExvZygpIHt9XG5cbmRpc2FibGVkTG9nLl9fcmVhY3REaXNhYmxlZExvZyA9IHRydWU7XG5mdW5jdGlvbiBkaXNhYmxlTG9ncygpIHtcbiAge1xuICAgIGlmIChkaXNhYmxlZERlcHRoID09PSAwKSB7XG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSByZWFjdC1pbnRlcm5hbC9uby1wcm9kdWN0aW9uLWxvZ2dpbmcgKi9cbiAgICAgIHByZXZMb2cgPSBjb25zb2xlLmxvZztcbiAgICAgIHByZXZJbmZvID0gY29uc29sZS5pbmZvO1xuICAgICAgcHJldldhcm4gPSBjb25zb2xlLndhcm47XG4gICAgICBwcmV2RXJyb3IgPSBjb25zb2xlLmVycm9yO1xuICAgICAgcHJldkdyb3VwID0gY29uc29sZS5ncm91cDtcbiAgICAgIHByZXZHcm91cENvbGxhcHNlZCA9IGNvbnNvbGUuZ3JvdXBDb2xsYXBzZWQ7XG4gICAgICBwcmV2R3JvdXBFbmQgPSBjb25zb2xlLmdyb3VwRW5kOyAvLyBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvaXNzdWVzLzE5MDk5XG5cbiAgICAgIHZhciBwcm9wcyA9IHtcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogZGlzYWJsZWRMb2csXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgICB9OyAvLyAkRmxvd0ZpeE1lIEZsb3cgdGhpbmtzIGNvbnNvbGUgaXMgaW1tdXRhYmxlLlxuXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhjb25zb2xlLCB7XG4gICAgICAgIGluZm86IHByb3BzLFxuICAgICAgICBsb2c6IHByb3BzLFxuICAgICAgICB3YXJuOiBwcm9wcyxcbiAgICAgICAgZXJyb3I6IHByb3BzLFxuICAgICAgICBncm91cDogcHJvcHMsXG4gICAgICAgIGdyb3VwQ29sbGFwc2VkOiBwcm9wcyxcbiAgICAgICAgZ3JvdXBFbmQ6IHByb3BzXG4gICAgICB9KTtcbiAgICAgIC8qIGVzbGludC1lbmFibGUgcmVhY3QtaW50ZXJuYWwvbm8tcHJvZHVjdGlvbi1sb2dnaW5nICovXG4gICAgfVxuXG4gICAgZGlzYWJsZWREZXB0aCsrO1xuICB9XG59XG5mdW5jdGlvbiByZWVuYWJsZUxvZ3MoKSB7XG4gIHtcbiAgICBkaXNhYmxlZERlcHRoLS07XG5cbiAgICBpZiAoZGlzYWJsZWREZXB0aCA9PT0gMCkge1xuICAgICAgLyogZXNsaW50LWRpc2FibGUgcmVhY3QtaW50ZXJuYWwvbm8tcHJvZHVjdGlvbi1sb2dnaW5nICovXG4gICAgICB2YXIgcHJvcHMgPSB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWVcbiAgICAgIH07IC8vICRGbG93Rml4TWUgRmxvdyB0aGlua3MgY29uc29sZSBpcyBpbW11dGFibGUuXG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGNvbnNvbGUsIHtcbiAgICAgICAgbG9nOiBhc3NpZ24oe30sIHByb3BzLCB7XG4gICAgICAgICAgdmFsdWU6IHByZXZMb2dcbiAgICAgICAgfSksXG4gICAgICAgIGluZm86IGFzc2lnbih7fSwgcHJvcHMsIHtcbiAgICAgICAgICB2YWx1ZTogcHJldkluZm9cbiAgICAgICAgfSksXG4gICAgICAgIHdhcm46IGFzc2lnbih7fSwgcHJvcHMsIHtcbiAgICAgICAgICB2YWx1ZTogcHJldldhcm5cbiAgICAgICAgfSksXG4gICAgICAgIGVycm9yOiBhc3NpZ24oe30sIHByb3BzLCB7XG4gICAgICAgICAgdmFsdWU6IHByZXZFcnJvclxuICAgICAgICB9KSxcbiAgICAgICAgZ3JvdXA6IGFzc2lnbih7fSwgcHJvcHMsIHtcbiAgICAgICAgICB2YWx1ZTogcHJldkdyb3VwXG4gICAgICAgIH0pLFxuICAgICAgICBncm91cENvbGxhcHNlZDogYXNzaWduKHt9LCBwcm9wcywge1xuICAgICAgICAgIHZhbHVlOiBwcmV2R3JvdXBDb2xsYXBzZWRcbiAgICAgICAgfSksXG4gICAgICAgIGdyb3VwRW5kOiBhc3NpZ24oe30sIHByb3BzLCB7XG4gICAgICAgICAgdmFsdWU6IHByZXZHcm91cEVuZFxuICAgICAgICB9KVxuICAgICAgfSk7XG4gICAgICAvKiBlc2xpbnQtZW5hYmxlIHJlYWN0LWludGVybmFsL25vLXByb2R1Y3Rpb24tbG9nZ2luZyAqL1xuICAgIH1cblxuICAgIGlmIChkaXNhYmxlZERlcHRoIDwgMCkge1xuICAgICAgZXJyb3IoJ2Rpc2FibGVkRGVwdGggZmVsbCBiZWxvdyB6ZXJvLiAnICsgJ1RoaXMgaXMgYSBidWcgaW4gUmVhY3QuIFBsZWFzZSBmaWxlIGFuIGlzc3VlLicpO1xuICAgIH1cbiAgfVxufVxuXG52YXIgUmVhY3RDdXJyZW50RGlzcGF0Y2hlciA9IFJlYWN0U2hhcmVkSW50ZXJuYWxzLlJlYWN0Q3VycmVudERpc3BhdGNoZXI7XG52YXIgcHJlZml4O1xuZnVuY3Rpb24gZGVzY3JpYmVCdWlsdEluQ29tcG9uZW50RnJhbWUobmFtZSwgc291cmNlLCBvd25lckZuKSB7XG4gIHtcbiAgICBpZiAocHJlZml4ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIEV4dHJhY3QgdGhlIFZNIHNwZWNpZmljIHByZWZpeCB1c2VkIGJ5IGVhY2ggbGluZS5cbiAgICAgIHRyeSB7XG4gICAgICAgIHRocm93IEVycm9yKCk7XG4gICAgICB9IGNhdGNoICh4KSB7XG4gICAgICAgIHZhciBtYXRjaCA9IHguc3RhY2sudHJpbSgpLm1hdGNoKC9cXG4oICooYXQgKT8pLyk7XG4gICAgICAgIHByZWZpeCA9IG1hdGNoICYmIG1hdGNoWzFdIHx8ICcnO1xuICAgICAgfVxuICAgIH0gLy8gV2UgdXNlIHRoZSBwcmVmaXggdG8gZW5zdXJlIG91ciBzdGFja3MgbGluZSB1cCB3aXRoIG5hdGl2ZSBzdGFjayBmcmFtZXMuXG5cblxuICAgIHJldHVybiAnXFxuJyArIHByZWZpeCArIG5hbWU7XG4gIH1cbn1cbnZhciByZWVudHJ5ID0gZmFsc2U7XG52YXIgY29tcG9uZW50RnJhbWVDYWNoZTtcblxue1xuICB2YXIgUG9zc2libHlXZWFrTWFwID0gdHlwZW9mIFdlYWtNYXAgPT09ICdmdW5jdGlvbicgPyBXZWFrTWFwIDogTWFwO1xuICBjb21wb25lbnRGcmFtZUNhY2hlID0gbmV3IFBvc3NpYmx5V2Vha01hcCgpO1xufVxuXG5mdW5jdGlvbiBkZXNjcmliZU5hdGl2ZUNvbXBvbmVudEZyYW1lKGZuLCBjb25zdHJ1Y3QpIHtcbiAgLy8gSWYgc29tZXRoaW5nIGFza2VkIGZvciBhIHN0YWNrIGluc2lkZSBhIGZha2UgcmVuZGVyLCBpdCBzaG91bGQgZ2V0IGlnbm9yZWQuXG4gIGlmICggIWZuIHx8IHJlZW50cnkpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICB7XG4gICAgdmFyIGZyYW1lID0gY29tcG9uZW50RnJhbWVDYWNoZS5nZXQoZm4pO1xuXG4gICAgaWYgKGZyYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBmcmFtZTtcbiAgICB9XG4gIH1cblxuICB2YXIgY29udHJvbDtcbiAgcmVlbnRyeSA9IHRydWU7XG4gIHZhciBwcmV2aW91c1ByZXBhcmVTdGFja1RyYWNlID0gRXJyb3IucHJlcGFyZVN0YWNrVHJhY2U7IC8vICRGbG93Rml4TWUgSXQgZG9lcyBhY2NlcHQgdW5kZWZpbmVkLlxuXG4gIEVycm9yLnByZXBhcmVTdGFja1RyYWNlID0gdW5kZWZpbmVkO1xuICB2YXIgcHJldmlvdXNEaXNwYXRjaGVyO1xuXG4gIHtcbiAgICBwcmV2aW91c0Rpc3BhdGNoZXIgPSBSZWFjdEN1cnJlbnREaXNwYXRjaGVyLmN1cnJlbnQ7IC8vIFNldCB0aGUgZGlzcGF0Y2hlciBpbiBERVYgYmVjYXVzZSB0aGlzIG1pZ2h0IGJlIGNhbGwgaW4gdGhlIHJlbmRlciBmdW5jdGlvblxuICAgIC8vIGZvciB3YXJuaW5ncy5cblxuICAgIFJlYWN0Q3VycmVudERpc3BhdGNoZXIuY3VycmVudCA9IG51bGw7XG4gICAgZGlzYWJsZUxvZ3MoKTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgLy8gVGhpcyBzaG91bGQgdGhyb3cuXG4gICAgaWYgKGNvbnN0cnVjdCkge1xuICAgICAgLy8gU29tZXRoaW5nIHNob3VsZCBiZSBzZXR0aW5nIHRoZSBwcm9wcyBpbiB0aGUgY29uc3RydWN0b3IuXG4gICAgICB2YXIgRmFrZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoKTtcbiAgICAgIH07IC8vICRGbG93Rml4TWVcblxuXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRmFrZS5wcm90b3R5cGUsICdwcm9wcycsIHtcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgLy8gV2UgdXNlIGEgdGhyb3dpbmcgc2V0dGVyIGluc3RlYWQgb2YgZnJvemVuIG9yIG5vbi13cml0YWJsZSBwcm9wc1xuICAgICAgICAgIC8vIGJlY2F1c2UgdGhhdCB3b24ndCB0aHJvdyBpbiBhIG5vbi1zdHJpY3QgbW9kZSBmdW5jdGlvbi5cbiAgICAgICAgICB0aHJvdyBFcnJvcigpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSAnb2JqZWN0JyAmJiBSZWZsZWN0LmNvbnN0cnVjdCkge1xuICAgICAgICAvLyBXZSBjb25zdHJ1Y3QgYSBkaWZmZXJlbnQgY29udHJvbCBmb3IgdGhpcyBjYXNlIHRvIGluY2x1ZGUgYW55IGV4dHJhXG4gICAgICAgIC8vIGZyYW1lcyBhZGRlZCBieSB0aGUgY29uc3RydWN0IGNhbGwuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgUmVmbGVjdC5jb25zdHJ1Y3QoRmFrZSwgW10pO1xuICAgICAgICB9IGNhdGNoICh4KSB7XG4gICAgICAgICAgY29udHJvbCA9IHg7XG4gICAgICAgIH1cblxuICAgICAgICBSZWZsZWN0LmNvbnN0cnVjdChmbiwgW10sIEZha2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBGYWtlLmNhbGwoKTtcbiAgICAgICAgfSBjYXRjaCAoeCkge1xuICAgICAgICAgIGNvbnRyb2wgPSB4O1xuICAgICAgICB9XG5cbiAgICAgICAgZm4uY2FsbChGYWtlLnByb3RvdHlwZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRocm93IEVycm9yKCk7XG4gICAgICB9IGNhdGNoICh4KSB7XG4gICAgICAgIGNvbnRyb2wgPSB4O1xuICAgICAgfVxuXG4gICAgICBmbigpO1xuICAgIH1cbiAgfSBjYXRjaCAoc2FtcGxlKSB7XG4gICAgLy8gVGhpcyBpcyBpbmxpbmVkIG1hbnVhbGx5IGJlY2F1c2UgY2xvc3VyZSBkb2Vzbid0IGRvIGl0IGZvciB1cy5cbiAgICBpZiAoc2FtcGxlICYmIGNvbnRyb2wgJiYgdHlwZW9mIHNhbXBsZS5zdGFjayA9PT0gJ3N0cmluZycpIHtcbiAgICAgIC8vIFRoaXMgZXh0cmFjdHMgdGhlIGZpcnN0IGZyYW1lIGZyb20gdGhlIHNhbXBsZSB0aGF0IGlzbid0IGFsc28gaW4gdGhlIGNvbnRyb2wuXG4gICAgICAvLyBTa2lwcGluZyBvbmUgZnJhbWUgdGhhdCB3ZSBhc3N1bWUgaXMgdGhlIGZyYW1lIHRoYXQgY2FsbHMgdGhlIHR3by5cbiAgICAgIHZhciBzYW1wbGVMaW5lcyA9IHNhbXBsZS5zdGFjay5zcGxpdCgnXFxuJyk7XG4gICAgICB2YXIgY29udHJvbExpbmVzID0gY29udHJvbC5zdGFjay5zcGxpdCgnXFxuJyk7XG4gICAgICB2YXIgcyA9IHNhbXBsZUxpbmVzLmxlbmd0aCAtIDE7XG4gICAgICB2YXIgYyA9IGNvbnRyb2xMaW5lcy5sZW5ndGggLSAxO1xuXG4gICAgICB3aGlsZSAocyA+PSAxICYmIGMgPj0gMCAmJiBzYW1wbGVMaW5lc1tzXSAhPT0gY29udHJvbExpbmVzW2NdKSB7XG4gICAgICAgIC8vIFdlIGV4cGVjdCBhdCBsZWFzdCBvbmUgc3RhY2sgZnJhbWUgdG8gYmUgc2hhcmVkLlxuICAgICAgICAvLyBUeXBpY2FsbHkgdGhpcyB3aWxsIGJlIHRoZSByb290IG1vc3Qgb25lLiBIb3dldmVyLCBzdGFjayBmcmFtZXMgbWF5IGJlXG4gICAgICAgIC8vIGN1dCBvZmYgZHVlIHRvIG1heGltdW0gc3RhY2sgbGltaXRzLiBJbiB0aGlzIGNhc2UsIG9uZSBtYXliZSBjdXQgb2ZmXG4gICAgICAgIC8vIGVhcmxpZXIgdGhhbiB0aGUgb3RoZXIuIFdlIGFzc3VtZSB0aGF0IHRoZSBzYW1wbGUgaXMgbG9uZ2VyIG9yIHRoZSBzYW1lXG4gICAgICAgIC8vIGFuZCB0aGVyZSBmb3IgY3V0IG9mZiBlYXJsaWVyLiBTbyB3ZSBzaG91bGQgZmluZCB0aGUgcm9vdCBtb3N0IGZyYW1lIGluXG4gICAgICAgIC8vIHRoZSBzYW1wbGUgc29tZXdoZXJlIGluIHRoZSBjb250cm9sLlxuICAgICAgICBjLS07XG4gICAgICB9XG5cbiAgICAgIGZvciAoOyBzID49IDEgJiYgYyA+PSAwOyBzLS0sIGMtLSkge1xuICAgICAgICAvLyBOZXh0IHdlIGZpbmQgdGhlIGZpcnN0IG9uZSB0aGF0IGlzbid0IHRoZSBzYW1lIHdoaWNoIHNob3VsZCBiZSB0aGVcbiAgICAgICAgLy8gZnJhbWUgdGhhdCBjYWxsZWQgb3VyIHNhbXBsZSBmdW5jdGlvbiBhbmQgdGhlIGNvbnRyb2wuXG4gICAgICAgIGlmIChzYW1wbGVMaW5lc1tzXSAhPT0gY29udHJvbExpbmVzW2NdKSB7XG4gICAgICAgICAgLy8gSW4gVjgsIHRoZSBmaXJzdCBsaW5lIGlzIGRlc2NyaWJpbmcgdGhlIG1lc3NhZ2UgYnV0IG90aGVyIFZNcyBkb24ndC5cbiAgICAgICAgICAvLyBJZiB3ZSdyZSBhYm91dCB0byByZXR1cm4gdGhlIGZpcnN0IGxpbmUsIGFuZCB0aGUgY29udHJvbCBpcyBhbHNvIG9uIHRoZSBzYW1lXG4gICAgICAgICAgLy8gbGluZSwgdGhhdCdzIGEgcHJldHR5IGdvb2QgaW5kaWNhdG9yIHRoYXQgb3VyIHNhbXBsZSB0aHJldyBhdCBzYW1lIGxpbmUgYXNcbiAgICAgICAgICAvLyB0aGUgY29udHJvbC4gSS5lLiBiZWZvcmUgd2UgZW50ZXJlZCB0aGUgc2FtcGxlIGZyYW1lLiBTbyB3ZSBpZ25vcmUgdGhpcyByZXN1bHQuXG4gICAgICAgICAgLy8gVGhpcyBjYW4gaGFwcGVuIGlmIHlvdSBwYXNzZWQgYSBjbGFzcyB0byBmdW5jdGlvbiBjb21wb25lbnQsIG9yIG5vbi1mdW5jdGlvbi5cbiAgICAgICAgICBpZiAocyAhPT0gMSB8fCBjICE9PSAxKSB7XG4gICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgIHMtLTtcbiAgICAgICAgICAgICAgYy0tOyAvLyBXZSBtYXkgc3RpbGwgaGF2ZSBzaW1pbGFyIGludGVybWVkaWF0ZSBmcmFtZXMgZnJvbSB0aGUgY29uc3RydWN0IGNhbGwuXG4gICAgICAgICAgICAgIC8vIFRoZSBuZXh0IG9uZSB0aGF0IGlzbid0IHRoZSBzYW1lIHNob3VsZCBiZSBvdXIgbWF0Y2ggdGhvdWdoLlxuXG4gICAgICAgICAgICAgIGlmIChjIDwgMCB8fCBzYW1wbGVMaW5lc1tzXSAhPT0gY29udHJvbExpbmVzW2NdKSB7XG4gICAgICAgICAgICAgICAgLy8gVjggYWRkcyBhIFwibmV3XCIgcHJlZml4IGZvciBuYXRpdmUgY2xhc3Nlcy4gTGV0J3MgcmVtb3ZlIGl0IHRvIG1ha2UgaXQgcHJldHRpZXIuXG4gICAgICAgICAgICAgICAgdmFyIF9mcmFtZSA9ICdcXG4nICsgc2FtcGxlTGluZXNbc10ucmVwbGFjZSgnIGF0IG5ldyAnLCAnIGF0ICcpOyAvLyBJZiBvdXIgY29tcG9uZW50IGZyYW1lIGlzIGxhYmVsZWQgXCI8YW5vbnltb3VzPlwiXG4gICAgICAgICAgICAgICAgLy8gYnV0IHdlIGhhdmUgYSB1c2VyLXByb3ZpZGVkIFwiZGlzcGxheU5hbWVcIlxuICAgICAgICAgICAgICAgIC8vIHNwbGljZSBpdCBpbiB0byBtYWtlIHRoZSBzdGFjayBtb3JlIHJlYWRhYmxlLlxuXG5cbiAgICAgICAgICAgICAgICBpZiAoZm4uZGlzcGxheU5hbWUgJiYgX2ZyYW1lLmluY2x1ZGVzKCc8YW5vbnltb3VzPicpKSB7XG4gICAgICAgICAgICAgICAgICBfZnJhbWUgPSBfZnJhbWUucmVwbGFjZSgnPGFub255bW91cz4nLCBmbi5kaXNwbGF5TmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRGcmFtZUNhY2hlLnNldChmbiwgX2ZyYW1lKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IC8vIFJldHVybiB0aGUgbGluZSB3ZSBmb3VuZC5cblxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIF9mcmFtZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSB3aGlsZSAocyA+PSAxICYmIGMgPj0gMCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0gZmluYWxseSB7XG4gICAgcmVlbnRyeSA9IGZhbHNlO1xuXG4gICAge1xuICAgICAgUmVhY3RDdXJyZW50RGlzcGF0Y2hlci5jdXJyZW50ID0gcHJldmlvdXNEaXNwYXRjaGVyO1xuICAgICAgcmVlbmFibGVMb2dzKCk7XG4gICAgfVxuXG4gICAgRXJyb3IucHJlcGFyZVN0YWNrVHJhY2UgPSBwcmV2aW91c1ByZXBhcmVTdGFja1RyYWNlO1xuICB9IC8vIEZhbGxiYWNrIHRvIGp1c3QgdXNpbmcgdGhlIG5hbWUgaWYgd2UgY291bGRuJ3QgbWFrZSBpdCB0aHJvdy5cblxuXG4gIHZhciBuYW1lID0gZm4gPyBmbi5kaXNwbGF5TmFtZSB8fCBmbi5uYW1lIDogJyc7XG4gIHZhciBzeW50aGV0aWNGcmFtZSA9IG5hbWUgPyBkZXNjcmliZUJ1aWx0SW5Db21wb25lbnRGcmFtZShuYW1lKSA6ICcnO1xuXG4gIHtcbiAgICBpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb21wb25lbnRGcmFtZUNhY2hlLnNldChmbiwgc3ludGhldGljRnJhbWUpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBzeW50aGV0aWNGcmFtZTtcbn1cbmZ1bmN0aW9uIGRlc2NyaWJlRnVuY3Rpb25Db21wb25lbnRGcmFtZShmbiwgc291cmNlLCBvd25lckZuKSB7XG4gIHtcbiAgICByZXR1cm4gZGVzY3JpYmVOYXRpdmVDb21wb25lbnRGcmFtZShmbiwgZmFsc2UpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNob3VsZENvbnN0cnVjdChDb21wb25lbnQpIHtcbiAgdmFyIHByb3RvdHlwZSA9IENvbXBvbmVudC5wcm90b3R5cGU7XG4gIHJldHVybiAhIShwcm90b3R5cGUgJiYgcHJvdG90eXBlLmlzUmVhY3RDb21wb25lbnQpO1xufVxuXG5mdW5jdGlvbiBkZXNjcmliZVVua25vd25FbGVtZW50VHlwZUZyYW1lSW5ERVYodHlwZSwgc291cmNlLCBvd25lckZuKSB7XG5cbiAgaWYgKHR5cGUgPT0gbnVsbCkge1xuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIGlmICh0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHtcbiAgICAgIHJldHVybiBkZXNjcmliZU5hdGl2ZUNvbXBvbmVudEZyYW1lKHR5cGUsIHNob3VsZENvbnN0cnVjdCh0eXBlKSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBkZXNjcmliZUJ1aWx0SW5Db21wb25lbnRGcmFtZSh0eXBlKTtcbiAgfVxuXG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgUkVBQ1RfU1VTUEVOU0VfVFlQRTpcbiAgICAgIHJldHVybiBkZXNjcmliZUJ1aWx0SW5Db21wb25lbnRGcmFtZSgnU3VzcGVuc2UnKTtcblxuICAgIGNhc2UgUkVBQ1RfU1VTUEVOU0VfTElTVF9UWVBFOlxuICAgICAgcmV0dXJuIGRlc2NyaWJlQnVpbHRJbkNvbXBvbmVudEZyYW1lKCdTdXNwZW5zZUxpc3QnKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgdHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICBzd2l0Y2ggKHR5cGUuJCR0eXBlb2YpIHtcbiAgICAgIGNhc2UgUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRTpcbiAgICAgICAgcmV0dXJuIGRlc2NyaWJlRnVuY3Rpb25Db21wb25lbnRGcmFtZSh0eXBlLnJlbmRlcik7XG5cbiAgICAgIGNhc2UgUkVBQ1RfTUVNT19UWVBFOlxuICAgICAgICAvLyBNZW1vIG1heSBjb250YWluIGFueSBjb21wb25lbnQgdHlwZSBzbyB3ZSByZWN1cnNpdmVseSByZXNvbHZlIGl0LlxuICAgICAgICByZXR1cm4gZGVzY3JpYmVVbmtub3duRWxlbWVudFR5cGVGcmFtZUluREVWKHR5cGUudHlwZSwgc291cmNlLCBvd25lckZuKTtcblxuICAgICAgY2FzZSBSRUFDVF9MQVpZX1RZUEU6XG4gICAgICAgIHtcbiAgICAgICAgICB2YXIgbGF6eUNvbXBvbmVudCA9IHR5cGU7XG4gICAgICAgICAgdmFyIHBheWxvYWQgPSBsYXp5Q29tcG9uZW50Ll9wYXlsb2FkO1xuICAgICAgICAgIHZhciBpbml0ID0gbGF6eUNvbXBvbmVudC5faW5pdDtcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBMYXp5IG1heSBjb250YWluIGFueSBjb21wb25lbnQgdHlwZSBzbyB3ZSByZWN1cnNpdmVseSByZXNvbHZlIGl0LlxuICAgICAgICAgICAgcmV0dXJuIGRlc2NyaWJlVW5rbm93bkVsZW1lbnRUeXBlRnJhbWVJbkRFVihpbml0KHBheWxvYWQpLCBzb3VyY2UsIG93bmVyRm4pO1xuICAgICAgICAgIH0gY2F0Y2ggKHgpIHt9XG4gICAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gJyc7XG59XG5cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbnZhciBsb2dnZWRUeXBlRmFpbHVyZXMgPSB7fTtcbnZhciBSZWFjdERlYnVnQ3VycmVudEZyYW1lID0gUmVhY3RTaGFyZWRJbnRlcm5hbHMuUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZTtcblxuZnVuY3Rpb24gc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQoZWxlbWVudCkge1xuICB7XG4gICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgIHZhciBvd25lciA9IGVsZW1lbnQuX293bmVyO1xuICAgICAgdmFyIHN0YWNrID0gZGVzY3JpYmVVbmtub3duRWxlbWVudFR5cGVGcmFtZUluREVWKGVsZW1lbnQudHlwZSwgZWxlbWVudC5fc291cmNlLCBvd25lciA/IG93bmVyLnR5cGUgOiBudWxsKTtcbiAgICAgIFJlYWN0RGVidWdDdXJyZW50RnJhbWUuc2V0RXh0cmFTdGFja0ZyYW1lKHN0YWNrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZS5zZXRFeHRyYVN0YWNrRnJhbWUobnVsbCk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGNoZWNrUHJvcFR5cGVzKHR5cGVTcGVjcywgdmFsdWVzLCBsb2NhdGlvbiwgY29tcG9uZW50TmFtZSwgZWxlbWVudCkge1xuICB7XG4gICAgLy8gJEZsb3dGaXhNZSBUaGlzIGlzIG9rYXkgYnV0IEZsb3cgZG9lc24ndCBrbm93IGl0LlxuICAgIHZhciBoYXMgPSBGdW5jdGlvbi5jYWxsLmJpbmQoaGFzT3duUHJvcGVydHkpO1xuXG4gICAgZm9yICh2YXIgdHlwZVNwZWNOYW1lIGluIHR5cGVTcGVjcykge1xuICAgICAgaWYgKGhhcyh0eXBlU3BlY3MsIHR5cGVTcGVjTmFtZSkpIHtcbiAgICAgICAgdmFyIGVycm9yJDEgPSB2b2lkIDA7IC8vIFByb3AgdHlwZSB2YWxpZGF0aW9uIG1heSB0aHJvdy4gSW4gY2FzZSB0aGV5IGRvLCB3ZSBkb24ndCB3YW50IHRvXG4gICAgICAgIC8vIGZhaWwgdGhlIHJlbmRlciBwaGFzZSB3aGVyZSBpdCBkaWRuJ3QgZmFpbCBiZWZvcmUuIFNvIHdlIGxvZyBpdC5cbiAgICAgICAgLy8gQWZ0ZXIgdGhlc2UgaGF2ZSBiZWVuIGNsZWFuZWQgdXAsIHdlJ2xsIGxldCB0aGVtIHRocm93LlxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gVGhpcyBpcyBpbnRlbnRpb25hbGx5IGFuIGludmFyaWFudCB0aGF0IGdldHMgY2F1Z2h0LiBJdCdzIHRoZSBzYW1lXG4gICAgICAgICAgLy8gYmVoYXZpb3IgYXMgd2l0aG91dCB0aGlzIHN0YXRlbWVudCBleGNlcHQgd2l0aCBhIGJldHRlciBtZXNzYWdlLlxuICAgICAgICAgIGlmICh0eXBlb2YgdHlwZVNwZWNzW3R5cGVTcGVjTmFtZV0gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1pbnRlcm5hbC9wcm9kLWVycm9yLWNvZGVzXG4gICAgICAgICAgICB2YXIgZXJyID0gRXJyb3IoKGNvbXBvbmVudE5hbWUgfHwgJ1JlYWN0IGNsYXNzJykgKyAnOiAnICsgbG9jYXRpb24gKyAnIHR5cGUgYCcgKyB0eXBlU3BlY05hbWUgKyAnYCBpcyBpbnZhbGlkOyAnICsgJ2l0IG11c3QgYmUgYSBmdW5jdGlvbiwgdXN1YWxseSBmcm9tIHRoZSBgcHJvcC10eXBlc2AgcGFja2FnZSwgYnV0IHJlY2VpdmVkIGAnICsgdHlwZW9mIHR5cGVTcGVjc1t0eXBlU3BlY05hbWVdICsgJ2AuJyArICdUaGlzIG9mdGVuIGhhcHBlbnMgYmVjYXVzZSBvZiB0eXBvcyBzdWNoIGFzIGBQcm9wVHlwZXMuZnVuY3Rpb25gIGluc3RlYWQgb2YgYFByb3BUeXBlcy5mdW5jYC4nKTtcbiAgICAgICAgICAgIGVyci5uYW1lID0gJ0ludmFyaWFudCBWaW9sYXRpb24nO1xuICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGVycm9yJDEgPSB0eXBlU3BlY3NbdHlwZVNwZWNOYW1lXSh2YWx1ZXMsIHR5cGVTcGVjTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIG51bGwsICdTRUNSRVRfRE9fTk9UX1BBU1NfVEhJU19PUl9ZT1VfV0lMTF9CRV9GSVJFRCcpO1xuICAgICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAgIGVycm9yJDEgPSBleDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlcnJvciQxICYmICEoZXJyb3IkMSBpbnN0YW5jZW9mIEVycm9yKSkge1xuICAgICAgICAgIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50KGVsZW1lbnQpO1xuXG4gICAgICAgICAgZXJyb3IoJyVzOiB0eXBlIHNwZWNpZmljYXRpb24gb2YgJXMnICsgJyBgJXNgIGlzIGludmFsaWQ7IHRoZSB0eXBlIGNoZWNrZXIgJyArICdmdW5jdGlvbiBtdXN0IHJldHVybiBgbnVsbGAgb3IgYW4gYEVycm9yYCBidXQgcmV0dXJuZWQgYSAlcy4gJyArICdZb3UgbWF5IGhhdmUgZm9yZ290dGVuIHRvIHBhc3MgYW4gYXJndW1lbnQgdG8gdGhlIHR5cGUgY2hlY2tlciAnICsgJ2NyZWF0b3IgKGFycmF5T2YsIGluc3RhbmNlT2YsIG9iamVjdE9mLCBvbmVPZiwgb25lT2ZUeXBlLCBhbmQgJyArICdzaGFwZSBhbGwgcmVxdWlyZSBhbiBhcmd1bWVudCkuJywgY29tcG9uZW50TmFtZSB8fCAnUmVhY3QgY2xhc3MnLCBsb2NhdGlvbiwgdHlwZVNwZWNOYW1lLCB0eXBlb2YgZXJyb3IkMSk7XG5cbiAgICAgICAgICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudChudWxsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlcnJvciQxIGluc3RhbmNlb2YgRXJyb3IgJiYgIShlcnJvciQxLm1lc3NhZ2UgaW4gbG9nZ2VkVHlwZUZhaWx1cmVzKSkge1xuICAgICAgICAgIC8vIE9ubHkgbW9uaXRvciB0aGlzIGZhaWx1cmUgb25jZSBiZWNhdXNlIHRoZXJlIHRlbmRzIHRvIGJlIGEgbG90IG9mIHRoZVxuICAgICAgICAgIC8vIHNhbWUgZXJyb3IuXG4gICAgICAgICAgbG9nZ2VkVHlwZUZhaWx1cmVzW2Vycm9yJDEubWVzc2FnZV0gPSB0cnVlO1xuICAgICAgICAgIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50KGVsZW1lbnQpO1xuXG4gICAgICAgICAgZXJyb3IoJ0ZhaWxlZCAlcyB0eXBlOiAlcycsIGxvY2F0aW9uLCBlcnJvciQxLm1lc3NhZ2UpO1xuXG4gICAgICAgICAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQobnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxudmFyIGlzQXJyYXlJbXBsID0gQXJyYXkuaXNBcnJheTsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJlZGVjbGFyZVxuXG5mdW5jdGlvbiBpc0FycmF5KGEpIHtcbiAgcmV0dXJuIGlzQXJyYXlJbXBsKGEpO1xufVxuXG4vKlxuICogVGhlIGAnJyArIHZhbHVlYCBwYXR0ZXJuICh1c2VkIGluIGluIHBlcmYtc2Vuc2l0aXZlIGNvZGUpIHRocm93cyBmb3IgU3ltYm9sXG4gKiBhbmQgVGVtcG9yYWwuKiB0eXBlcy4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9wdWxsLzIyMDY0LlxuICpcbiAqIFRoZSBmdW5jdGlvbnMgaW4gdGhpcyBtb2R1bGUgd2lsbCB0aHJvdyBhbiBlYXNpZXItdG8tdW5kZXJzdGFuZCxcbiAqIGVhc2llci10by1kZWJ1ZyBleGNlcHRpb24gd2l0aCBhIGNsZWFyIGVycm9ycyBtZXNzYWdlIG1lc3NhZ2UgZXhwbGFpbmluZyB0aGVcbiAqIHByb2JsZW0uIChJbnN0ZWFkIG9mIGEgY29uZnVzaW5nIGV4Y2VwdGlvbiB0aHJvd24gaW5zaWRlIHRoZSBpbXBsZW1lbnRhdGlvblxuICogb2YgdGhlIGB2YWx1ZWAgb2JqZWN0KS5cbiAqL1xuLy8gJEZsb3dGaXhNZSBvbmx5IGNhbGxlZCBpbiBERVYsIHNvIHZvaWQgcmV0dXJuIGlzIG5vdCBwb3NzaWJsZS5cbmZ1bmN0aW9uIHR5cGVOYW1lKHZhbHVlKSB7XG4gIHtcbiAgICAvLyB0b1N0cmluZ1RhZyBpcyBuZWVkZWQgZm9yIG5hbWVzcGFjZWQgdHlwZXMgbGlrZSBUZW1wb3JhbC5JbnN0YW50XG4gICAgdmFyIGhhc1RvU3RyaW5nVGFnID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wudG9TdHJpbmdUYWc7XG4gICAgdmFyIHR5cGUgPSBoYXNUb1N0cmluZ1RhZyAmJiB2YWx1ZVtTeW1ib2wudG9TdHJpbmdUYWddIHx8IHZhbHVlLmNvbnN0cnVjdG9yLm5hbWUgfHwgJ09iamVjdCc7XG4gICAgcmV0dXJuIHR5cGU7XG4gIH1cbn0gLy8gJEZsb3dGaXhNZSBvbmx5IGNhbGxlZCBpbiBERVYsIHNvIHZvaWQgcmV0dXJuIGlzIG5vdCBwb3NzaWJsZS5cblxuXG5mdW5jdGlvbiB3aWxsQ29lcmNpb25UaHJvdyh2YWx1ZSkge1xuICB7XG4gICAgdHJ5IHtcbiAgICAgIHRlc3RTdHJpbmdDb2VyY2lvbih2YWx1ZSk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHRlc3RTdHJpbmdDb2VyY2lvbih2YWx1ZSkge1xuICAvLyBJZiB5b3UgZW5kZWQgdXAgaGVyZSBieSBmb2xsb3dpbmcgYW4gZXhjZXB0aW9uIGNhbGwgc3RhY2ssIGhlcmUncyB3aGF0J3NcbiAgLy8gaGFwcGVuZWQ6IHlvdSBzdXBwbGllZCBhbiBvYmplY3Qgb3Igc3ltYm9sIHZhbHVlIHRvIFJlYWN0IChhcyBhIHByb3AsIGtleSxcbiAgLy8gRE9NIGF0dHJpYnV0ZSwgQ1NTIHByb3BlcnR5LCBzdHJpbmcgcmVmLCBldGMuKSBhbmQgd2hlbiBSZWFjdCB0cmllZCB0b1xuICAvLyBjb2VyY2UgaXQgdG8gYSBzdHJpbmcgdXNpbmcgYCcnICsgdmFsdWVgLCBhbiBleGNlcHRpb24gd2FzIHRocm93bi5cbiAgLy9cbiAgLy8gVGhlIG1vc3QgY29tbW9uIHR5cGVzIHRoYXQgd2lsbCBjYXVzZSB0aGlzIGV4Y2VwdGlvbiBhcmUgYFN5bWJvbGAgaW5zdGFuY2VzXG4gIC8vIGFuZCBUZW1wb3JhbCBvYmplY3RzIGxpa2UgYFRlbXBvcmFsLkluc3RhbnRgLiBCdXQgYW55IG9iamVjdCB0aGF0IGhhcyBhXG4gIC8vIGB2YWx1ZU9mYCBvciBgW1N5bWJvbC50b1ByaW1pdGl2ZV1gIG1ldGhvZCB0aGF0IHRocm93cyB3aWxsIGFsc28gY2F1c2UgdGhpc1xuICAvLyBleGNlcHRpb24uIChMaWJyYXJ5IGF1dGhvcnMgZG8gdGhpcyB0byBwcmV2ZW50IHVzZXJzIGZyb20gdXNpbmcgYnVpbHQtaW5cbiAgLy8gbnVtZXJpYyBvcGVyYXRvcnMgbGlrZSBgK2Agb3IgY29tcGFyaXNvbiBvcGVyYXRvcnMgbGlrZSBgPj1gIGJlY2F1c2UgY3VzdG9tXG4gIC8vIG1ldGhvZHMgYXJlIG5lZWRlZCB0byBwZXJmb3JtIGFjY3VyYXRlIGFyaXRobWV0aWMgb3IgY29tcGFyaXNvbi4pXG4gIC8vXG4gIC8vIFRvIGZpeCB0aGUgcHJvYmxlbSwgY29lcmNlIHRoaXMgb2JqZWN0IG9yIHN5bWJvbCB2YWx1ZSB0byBhIHN0cmluZyBiZWZvcmVcbiAgLy8gcGFzc2luZyBpdCB0byBSZWFjdC4gVGhlIG1vc3QgcmVsaWFibGUgd2F5IGlzIHVzdWFsbHkgYFN0cmluZyh2YWx1ZSlgLlxuICAvL1xuICAvLyBUbyBmaW5kIHdoaWNoIHZhbHVlIGlzIHRocm93aW5nLCBjaGVjayB0aGUgYnJvd3NlciBvciBkZWJ1Z2dlciBjb25zb2xlLlxuICAvLyBCZWZvcmUgdGhpcyBleGNlcHRpb24gd2FzIHRocm93biwgdGhlcmUgc2hvdWxkIGJlIGBjb25zb2xlLmVycm9yYCBvdXRwdXRcbiAgLy8gdGhhdCBzaG93cyB0aGUgdHlwZSAoU3ltYm9sLCBUZW1wb3JhbC5QbGFpbkRhdGUsIGV0Yy4pIHRoYXQgY2F1c2VkIHRoZVxuICAvLyBwcm9ibGVtIGFuZCBob3cgdGhhdCB0eXBlIHdhcyB1c2VkOiBrZXksIGF0cnJpYnV0ZSwgaW5wdXQgdmFsdWUgcHJvcCwgZXRjLlxuICAvLyBJbiBtb3N0IGNhc2VzLCB0aGlzIGNvbnNvbGUgb3V0cHV0IGFsc28gc2hvd3MgdGhlIGNvbXBvbmVudCBhbmQgaXRzXG4gIC8vIGFuY2VzdG9yIGNvbXBvbmVudHMgd2hlcmUgdGhlIGV4Y2VwdGlvbiBoYXBwZW5lZC5cbiAgLy9cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWludGVybmFsL3NhZmUtc3RyaW5nLWNvZXJjaW9uXG4gIHJldHVybiAnJyArIHZhbHVlO1xufVxuZnVuY3Rpb24gY2hlY2tLZXlTdHJpbmdDb2VyY2lvbih2YWx1ZSkge1xuICB7XG4gICAgaWYgKHdpbGxDb2VyY2lvblRocm93KHZhbHVlKSkge1xuICAgICAgZXJyb3IoJ1RoZSBwcm92aWRlZCBrZXkgaXMgYW4gdW5zdXBwb3J0ZWQgdHlwZSAlcy4nICsgJyBUaGlzIHZhbHVlIG11c3QgYmUgY29lcmNlZCB0byBhIHN0cmluZyBiZWZvcmUgYmVmb3JlIHVzaW5nIGl0IGhlcmUuJywgdHlwZU5hbWUodmFsdWUpKTtcblxuICAgICAgcmV0dXJuIHRlc3RTdHJpbmdDb2VyY2lvbih2YWx1ZSk7IC8vIHRocm93ICh0byBoZWxwIGNhbGxlcnMgZmluZCB0cm91Ymxlc2hvb3RpbmcgY29tbWVudHMpXG4gICAgfVxuICB9XG59XG5cbnZhciBSZWFjdEN1cnJlbnRPd25lciA9IFJlYWN0U2hhcmVkSW50ZXJuYWxzLlJlYWN0Q3VycmVudE93bmVyO1xudmFyIFJFU0VSVkVEX1BST1BTID0ge1xuICBrZXk6IHRydWUsXG4gIHJlZjogdHJ1ZSxcbiAgX19zZWxmOiB0cnVlLFxuICBfX3NvdXJjZTogdHJ1ZVxufTtcbnZhciBzcGVjaWFsUHJvcEtleVdhcm5pbmdTaG93bjtcbnZhciBzcGVjaWFsUHJvcFJlZldhcm5pbmdTaG93bjtcbnZhciBkaWRXYXJuQWJvdXRTdHJpbmdSZWZzO1xuXG57XG4gIGRpZFdhcm5BYm91dFN0cmluZ1JlZnMgPSB7fTtcbn1cblxuZnVuY3Rpb24gaGFzVmFsaWRSZWYoY29uZmlnKSB7XG4gIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChjb25maWcsICdyZWYnKSkge1xuICAgICAgdmFyIGdldHRlciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoY29uZmlnLCAncmVmJykuZ2V0O1xuXG4gICAgICBpZiAoZ2V0dGVyICYmIGdldHRlci5pc1JlYWN0V2FybmluZykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNvbmZpZy5yZWYgIT09IHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gaGFzVmFsaWRLZXkoY29uZmlnKSB7XG4gIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChjb25maWcsICdrZXknKSkge1xuICAgICAgdmFyIGdldHRlciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoY29uZmlnLCAna2V5JykuZ2V0O1xuXG4gICAgICBpZiAoZ2V0dGVyICYmIGdldHRlci5pc1JlYWN0V2FybmluZykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNvbmZpZy5rZXkgIT09IHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gd2FybklmU3RyaW5nUmVmQ2Fubm90QmVBdXRvQ29udmVydGVkKGNvbmZpZywgc2VsZikge1xuICB7XG4gICAgaWYgKHR5cGVvZiBjb25maWcucmVmID09PSAnc3RyaW5nJyAmJiBSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50ICYmIHNlbGYgJiYgUmVhY3RDdXJyZW50T3duZXIuY3VycmVudC5zdGF0ZU5vZGUgIT09IHNlbGYpIHtcbiAgICAgIHZhciBjb21wb25lbnROYW1lID0gZ2V0Q29tcG9uZW50TmFtZUZyb21UeXBlKFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQudHlwZSk7XG5cbiAgICAgIGlmICghZGlkV2FybkFib3V0U3RyaW5nUmVmc1tjb21wb25lbnROYW1lXSkge1xuICAgICAgICBlcnJvcignQ29tcG9uZW50IFwiJXNcIiBjb250YWlucyB0aGUgc3RyaW5nIHJlZiBcIiVzXCIuICcgKyAnU3VwcG9ydCBmb3Igc3RyaW5nIHJlZnMgd2lsbCBiZSByZW1vdmVkIGluIGEgZnV0dXJlIG1ham9yIHJlbGVhc2UuICcgKyAnVGhpcyBjYXNlIGNhbm5vdCBiZSBhdXRvbWF0aWNhbGx5IGNvbnZlcnRlZCB0byBhbiBhcnJvdyBmdW5jdGlvbi4gJyArICdXZSBhc2sgeW91IHRvIG1hbnVhbGx5IGZpeCB0aGlzIGNhc2UgYnkgdXNpbmcgdXNlUmVmKCkgb3IgY3JlYXRlUmVmKCkgaW5zdGVhZC4gJyArICdMZWFybiBtb3JlIGFib3V0IHVzaW5nIHJlZnMgc2FmZWx5IGhlcmU6ICcgKyAnaHR0cHM6Ly9yZWFjdGpzLm9yZy9saW5rL3N0cmljdC1tb2RlLXN0cmluZy1yZWYnLCBnZXRDb21wb25lbnROYW1lRnJvbVR5cGUoUmVhY3RDdXJyZW50T3duZXIuY3VycmVudC50eXBlKSwgY29uZmlnLnJlZik7XG5cbiAgICAgICAgZGlkV2FybkFib3V0U3RyaW5nUmVmc1tjb21wb25lbnROYW1lXSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGRlZmluZUtleVByb3BXYXJuaW5nR2V0dGVyKHByb3BzLCBkaXNwbGF5TmFtZSkge1xuICB7XG4gICAgdmFyIHdhcm5BYm91dEFjY2Vzc2luZ0tleSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghc3BlY2lhbFByb3BLZXlXYXJuaW5nU2hvd24pIHtcbiAgICAgICAgc3BlY2lhbFByb3BLZXlXYXJuaW5nU2hvd24gPSB0cnVlO1xuXG4gICAgICAgIGVycm9yKCclczogYGtleWAgaXMgbm90IGEgcHJvcC4gVHJ5aW5nIHRvIGFjY2VzcyBpdCB3aWxsIHJlc3VsdCAnICsgJ2luIGB1bmRlZmluZWRgIGJlaW5nIHJldHVybmVkLiBJZiB5b3UgbmVlZCB0byBhY2Nlc3MgdGhlIHNhbWUgJyArICd2YWx1ZSB3aXRoaW4gdGhlIGNoaWxkIGNvbXBvbmVudCwgeW91IHNob3VsZCBwYXNzIGl0IGFzIGEgZGlmZmVyZW50ICcgKyAncHJvcC4gKGh0dHBzOi8vcmVhY3Rqcy5vcmcvbGluay9zcGVjaWFsLXByb3BzKScsIGRpc3BsYXlOYW1lKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgd2FybkFib3V0QWNjZXNzaW5nS2V5LmlzUmVhY3RXYXJuaW5nID0gdHJ1ZTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvcHMsICdrZXknLCB7XG4gICAgICBnZXQ6IHdhcm5BYm91dEFjY2Vzc2luZ0tleSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIGRlZmluZVJlZlByb3BXYXJuaW5nR2V0dGVyKHByb3BzLCBkaXNwbGF5TmFtZSkge1xuICB7XG4gICAgdmFyIHdhcm5BYm91dEFjY2Vzc2luZ1JlZiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghc3BlY2lhbFByb3BSZWZXYXJuaW5nU2hvd24pIHtcbiAgICAgICAgc3BlY2lhbFByb3BSZWZXYXJuaW5nU2hvd24gPSB0cnVlO1xuXG4gICAgICAgIGVycm9yKCclczogYHJlZmAgaXMgbm90IGEgcHJvcC4gVHJ5aW5nIHRvIGFjY2VzcyBpdCB3aWxsIHJlc3VsdCAnICsgJ2luIGB1bmRlZmluZWRgIGJlaW5nIHJldHVybmVkLiBJZiB5b3UgbmVlZCB0byBhY2Nlc3MgdGhlIHNhbWUgJyArICd2YWx1ZSB3aXRoaW4gdGhlIGNoaWxkIGNvbXBvbmVudCwgeW91IHNob3VsZCBwYXNzIGl0IGFzIGEgZGlmZmVyZW50ICcgKyAncHJvcC4gKGh0dHBzOi8vcmVhY3Rqcy5vcmcvbGluay9zcGVjaWFsLXByb3BzKScsIGRpc3BsYXlOYW1lKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgd2FybkFib3V0QWNjZXNzaW5nUmVmLmlzUmVhY3RXYXJuaW5nID0gdHJ1ZTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvcHMsICdyZWYnLCB7XG4gICAgICBnZXQ6IHdhcm5BYm91dEFjY2Vzc2luZ1JlZixcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9XG59XG4vKipcbiAqIEZhY3RvcnkgbWV0aG9kIHRvIGNyZWF0ZSBhIG5ldyBSZWFjdCBlbGVtZW50LiBUaGlzIG5vIGxvbmdlciBhZGhlcmVzIHRvXG4gKiB0aGUgY2xhc3MgcGF0dGVybiwgc28gZG8gbm90IHVzZSBuZXcgdG8gY2FsbCBpdC4gQWxzbywgaW5zdGFuY2VvZiBjaGVja1xuICogd2lsbCBub3Qgd29yay4gSW5zdGVhZCB0ZXN0ICQkdHlwZW9mIGZpZWxkIGFnYWluc3QgU3ltYm9sLmZvcigncmVhY3QuZWxlbWVudCcpIHRvIGNoZWNrXG4gKiBpZiBzb21ldGhpbmcgaXMgYSBSZWFjdCBFbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7Kn0gdHlwZVxuICogQHBhcmFtIHsqfSBwcm9wc1xuICogQHBhcmFtIHsqfSBrZXlcbiAqIEBwYXJhbSB7c3RyaW5nfG9iamVjdH0gcmVmXG4gKiBAcGFyYW0geyp9IG93bmVyXG4gKiBAcGFyYW0geyp9IHNlbGYgQSAqdGVtcG9yYXJ5KiBoZWxwZXIgdG8gZGV0ZWN0IHBsYWNlcyB3aGVyZSBgdGhpc2AgaXNcbiAqIGRpZmZlcmVudCBmcm9tIHRoZSBgb3duZXJgIHdoZW4gUmVhY3QuY3JlYXRlRWxlbWVudCBpcyBjYWxsZWQsIHNvIHRoYXQgd2VcbiAqIGNhbiB3YXJuLiBXZSB3YW50IHRvIGdldCByaWQgb2Ygb3duZXIgYW5kIHJlcGxhY2Ugc3RyaW5nIGByZWZgcyB3aXRoIGFycm93XG4gKiBmdW5jdGlvbnMsIGFuZCBhcyBsb25nIGFzIGB0aGlzYCBhbmQgb3duZXIgYXJlIHRoZSBzYW1lLCB0aGVyZSB3aWxsIGJlIG5vXG4gKiBjaGFuZ2UgaW4gYmVoYXZpb3IuXG4gKiBAcGFyYW0geyp9IHNvdXJjZSBBbiBhbm5vdGF0aW9uIG9iamVjdCAoYWRkZWQgYnkgYSB0cmFuc3BpbGVyIG9yIG90aGVyd2lzZSlcbiAqIGluZGljYXRpbmcgZmlsZW5hbWUsIGxpbmUgbnVtYmVyLCBhbmQvb3Igb3RoZXIgaW5mb3JtYXRpb24uXG4gKiBAaW50ZXJuYWxcbiAqL1xuXG5cbnZhciBSZWFjdEVsZW1lbnQgPSBmdW5jdGlvbiAodHlwZSwga2V5LCByZWYsIHNlbGYsIHNvdXJjZSwgb3duZXIsIHByb3BzKSB7XG4gIHZhciBlbGVtZW50ID0ge1xuICAgIC8vIFRoaXMgdGFnIGFsbG93cyB1cyB0byB1bmlxdWVseSBpZGVudGlmeSB0aGlzIGFzIGEgUmVhY3QgRWxlbWVudFxuICAgICQkdHlwZW9mOiBSRUFDVF9FTEVNRU5UX1RZUEUsXG4gICAgLy8gQnVpbHQtaW4gcHJvcGVydGllcyB0aGF0IGJlbG9uZyBvbiB0aGUgZWxlbWVudFxuICAgIHR5cGU6IHR5cGUsXG4gICAga2V5OiBrZXksXG4gICAgcmVmOiByZWYsXG4gICAgcHJvcHM6IHByb3BzLFxuICAgIC8vIFJlY29yZCB0aGUgY29tcG9uZW50IHJlc3BvbnNpYmxlIGZvciBjcmVhdGluZyB0aGlzIGVsZW1lbnQuXG4gICAgX293bmVyOiBvd25lclxuICB9O1xuXG4gIHtcbiAgICAvLyBUaGUgdmFsaWRhdGlvbiBmbGFnIGlzIGN1cnJlbnRseSBtdXRhdGl2ZS4gV2UgcHV0IGl0IG9uXG4gICAgLy8gYW4gZXh0ZXJuYWwgYmFja2luZyBzdG9yZSBzbyB0aGF0IHdlIGNhbiBmcmVlemUgdGhlIHdob2xlIG9iamVjdC5cbiAgICAvLyBUaGlzIGNhbiBiZSByZXBsYWNlZCB3aXRoIGEgV2Vha01hcCBvbmNlIHRoZXkgYXJlIGltcGxlbWVudGVkIGluXG4gICAgLy8gY29tbW9ubHkgdXNlZCBkZXZlbG9wbWVudCBlbnZpcm9ubWVudHMuXG4gICAgZWxlbWVudC5fc3RvcmUgPSB7fTsgLy8gVG8gbWFrZSBjb21wYXJpbmcgUmVhY3RFbGVtZW50cyBlYXNpZXIgZm9yIHRlc3RpbmcgcHVycG9zZXMsIHdlIG1ha2VcbiAgICAvLyB0aGUgdmFsaWRhdGlvbiBmbGFnIG5vbi1lbnVtZXJhYmxlICh3aGVyZSBwb3NzaWJsZSwgd2hpY2ggc2hvdWxkXG4gICAgLy8gaW5jbHVkZSBldmVyeSBlbnZpcm9ubWVudCB3ZSBydW4gdGVzdHMgaW4pLCBzbyB0aGUgdGVzdCBmcmFtZXdvcmtcbiAgICAvLyBpZ25vcmVzIGl0LlxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVsZW1lbnQuX3N0b3JlLCAndmFsaWRhdGVkJywge1xuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICB2YWx1ZTogZmFsc2VcbiAgICB9KTsgLy8gc2VsZiBhbmQgc291cmNlIGFyZSBERVYgb25seSBwcm9wZXJ0aWVzLlxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVsZW1lbnQsICdfc2VsZicsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiBzZWxmXG4gICAgfSk7IC8vIFR3byBlbGVtZW50cyBjcmVhdGVkIGluIHR3byBkaWZmZXJlbnQgcGxhY2VzIHNob3VsZCBiZSBjb25zaWRlcmVkXG4gICAgLy8gZXF1YWwgZm9yIHRlc3RpbmcgcHVycG9zZXMgYW5kIHRoZXJlZm9yZSB3ZSBoaWRlIGl0IGZyb20gZW51bWVyYXRpb24uXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWxlbWVudCwgJ19zb3VyY2UnLCB7XG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogc291cmNlXG4gICAgfSk7XG5cbiAgICBpZiAoT2JqZWN0LmZyZWV6ZSkge1xuICAgICAgT2JqZWN0LmZyZWV6ZShlbGVtZW50LnByb3BzKTtcbiAgICAgIE9iamVjdC5mcmVlemUoZWxlbWVudCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59O1xuLyoqXG4gKiBodHRwczovL2dpdGh1Yi5jb20vcmVhY3Rqcy9yZmNzL3B1bGwvMTA3XG4gKiBAcGFyYW0geyp9IHR5cGVcbiAqIEBwYXJhbSB7b2JqZWN0fSBwcm9wc1xuICogQHBhcmFtIHtzdHJpbmd9IGtleVxuICovXG5cbmZ1bmN0aW9uIGpzeERFVih0eXBlLCBjb25maWcsIG1heWJlS2V5LCBzb3VyY2UsIHNlbGYpIHtcbiAge1xuICAgIHZhciBwcm9wTmFtZTsgLy8gUmVzZXJ2ZWQgbmFtZXMgYXJlIGV4dHJhY3RlZFxuXG4gICAgdmFyIHByb3BzID0ge307XG4gICAgdmFyIGtleSA9IG51bGw7XG4gICAgdmFyIHJlZiA9IG51bGw7IC8vIEN1cnJlbnRseSwga2V5IGNhbiBiZSBzcHJlYWQgaW4gYXMgYSBwcm9wLiBUaGlzIGNhdXNlcyBhIHBvdGVudGlhbFxuICAgIC8vIGlzc3VlIGlmIGtleSBpcyBhbHNvIGV4cGxpY2l0bHkgZGVjbGFyZWQgKGllLiA8ZGl2IHsuLi5wcm9wc30ga2V5PVwiSGlcIiAvPlxuICAgIC8vIG9yIDxkaXYga2V5PVwiSGlcIiB7Li4ucHJvcHN9IC8+ICkuIFdlIHdhbnQgdG8gZGVwcmVjYXRlIGtleSBzcHJlYWQsXG4gICAgLy8gYnV0IGFzIGFuIGludGVybWVkaWFyeSBzdGVwLCB3ZSB3aWxsIHVzZSBqc3hERVYgZm9yIGV2ZXJ5dGhpbmcgZXhjZXB0XG4gICAgLy8gPGRpdiB7Li4ucHJvcHN9IGtleT1cIkhpXCIgLz4sIGJlY2F1c2Ugd2UgYXJlbid0IGN1cnJlbnRseSBhYmxlIHRvIHRlbGwgaWZcbiAgICAvLyBrZXkgaXMgZXhwbGljaXRseSBkZWNsYXJlZCB0byBiZSB1bmRlZmluZWQgb3Igbm90LlxuXG4gICAgaWYgKG1heWJlS2V5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHtcbiAgICAgICAgY2hlY2tLZXlTdHJpbmdDb2VyY2lvbihtYXliZUtleSk7XG4gICAgICB9XG5cbiAgICAgIGtleSA9ICcnICsgbWF5YmVLZXk7XG4gICAgfVxuXG4gICAgaWYgKGhhc1ZhbGlkS2V5KGNvbmZpZykpIHtcbiAgICAgIHtcbiAgICAgICAgY2hlY2tLZXlTdHJpbmdDb2VyY2lvbihjb25maWcua2V5KTtcbiAgICAgIH1cblxuICAgICAga2V5ID0gJycgKyBjb25maWcua2V5O1xuICAgIH1cblxuICAgIGlmIChoYXNWYWxpZFJlZihjb25maWcpKSB7XG4gICAgICByZWYgPSBjb25maWcucmVmO1xuICAgICAgd2FybklmU3RyaW5nUmVmQ2Fubm90QmVBdXRvQ29udmVydGVkKGNvbmZpZywgc2VsZik7XG4gICAgfSAvLyBSZW1haW5pbmcgcHJvcGVydGllcyBhcmUgYWRkZWQgdG8gYSBuZXcgcHJvcHMgb2JqZWN0XG5cblxuICAgIGZvciAocHJvcE5hbWUgaW4gY29uZmlnKSB7XG4gICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChjb25maWcsIHByb3BOYW1lKSAmJiAhUkVTRVJWRURfUFJPUFMuaGFzT3duUHJvcGVydHkocHJvcE5hbWUpKSB7XG4gICAgICAgIHByb3BzW3Byb3BOYW1lXSA9IGNvbmZpZ1twcm9wTmFtZV07XG4gICAgICB9XG4gICAgfSAvLyBSZXNvbHZlIGRlZmF1bHQgcHJvcHNcblxuXG4gICAgaWYgKHR5cGUgJiYgdHlwZS5kZWZhdWx0UHJvcHMpIHtcbiAgICAgIHZhciBkZWZhdWx0UHJvcHMgPSB0eXBlLmRlZmF1bHRQcm9wcztcblxuICAgICAgZm9yIChwcm9wTmFtZSBpbiBkZWZhdWx0UHJvcHMpIHtcbiAgICAgICAgaWYgKHByb3BzW3Byb3BOYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcHJvcHNbcHJvcE5hbWVdID0gZGVmYXVsdFByb3BzW3Byb3BOYW1lXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChrZXkgfHwgcmVmKSB7XG4gICAgICB2YXIgZGlzcGxheU5hbWUgPSB0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJyA/IHR5cGUuZGlzcGxheU5hbWUgfHwgdHlwZS5uYW1lIHx8ICdVbmtub3duJyA6IHR5cGU7XG5cbiAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgZGVmaW5lS2V5UHJvcFdhcm5pbmdHZXR0ZXIocHJvcHMsIGRpc3BsYXlOYW1lKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlZikge1xuICAgICAgICBkZWZpbmVSZWZQcm9wV2FybmluZ0dldHRlcihwcm9wcywgZGlzcGxheU5hbWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBSZWFjdEVsZW1lbnQodHlwZSwga2V5LCByZWYsIHNlbGYsIHNvdXJjZSwgUmVhY3RDdXJyZW50T3duZXIuY3VycmVudCwgcHJvcHMpO1xuICB9XG59XG5cbnZhciBSZWFjdEN1cnJlbnRPd25lciQxID0gUmVhY3RTaGFyZWRJbnRlcm5hbHMuUmVhY3RDdXJyZW50T3duZXI7XG52YXIgUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZSQxID0gUmVhY3RTaGFyZWRJbnRlcm5hbHMuUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZTtcblxuZnVuY3Rpb24gc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQkMShlbGVtZW50KSB7XG4gIHtcbiAgICBpZiAoZWxlbWVudCkge1xuICAgICAgdmFyIG93bmVyID0gZWxlbWVudC5fb3duZXI7XG4gICAgICB2YXIgc3RhY2sgPSBkZXNjcmliZVVua25vd25FbGVtZW50VHlwZUZyYW1lSW5ERVYoZWxlbWVudC50eXBlLCBlbGVtZW50Ll9zb3VyY2UsIG93bmVyID8gb3duZXIudHlwZSA6IG51bGwpO1xuICAgICAgUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZSQxLnNldEV4dHJhU3RhY2tGcmFtZShzdGFjayk7XG4gICAgfSBlbHNlIHtcbiAgICAgIFJlYWN0RGVidWdDdXJyZW50RnJhbWUkMS5zZXRFeHRyYVN0YWNrRnJhbWUobnVsbCk7XG4gICAgfVxuICB9XG59XG5cbnZhciBwcm9wVHlwZXNNaXNzcGVsbFdhcm5pbmdTaG93bjtcblxue1xuICBwcm9wVHlwZXNNaXNzcGVsbFdhcm5pbmdTaG93biA9IGZhbHNlO1xufVxuLyoqXG4gKiBWZXJpZmllcyB0aGUgb2JqZWN0IGlzIGEgUmVhY3RFbGVtZW50LlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNpc3ZhbGlkZWxlbWVudFxuICogQHBhcmFtIHs/b2JqZWN0fSBvYmplY3RcbiAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgYG9iamVjdGAgaXMgYSBSZWFjdEVsZW1lbnQuXG4gKiBAZmluYWxcbiAqL1xuXG5cbmZ1bmN0aW9uIGlzVmFsaWRFbGVtZW50KG9iamVjdCkge1xuICB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmIG9iamVjdCAhPT0gbnVsbCAmJiBvYmplY3QuJCR0eXBlb2YgPT09IFJFQUNUX0VMRU1FTlRfVFlQRTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXREZWNsYXJhdGlvbkVycm9yQWRkZW5kdW0oKSB7XG4gIHtcbiAgICBpZiAoUmVhY3RDdXJyZW50T3duZXIkMS5jdXJyZW50KSB7XG4gICAgICB2YXIgbmFtZSA9IGdldENvbXBvbmVudE5hbWVGcm9tVHlwZShSZWFjdEN1cnJlbnRPd25lciQxLmN1cnJlbnQudHlwZSk7XG5cbiAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgIHJldHVybiAnXFxuXFxuQ2hlY2sgdGhlIHJlbmRlciBtZXRob2Qgb2YgYCcgKyBuYW1lICsgJ2AuJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gJyc7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0U291cmNlSW5mb0Vycm9yQWRkZW5kdW0oc291cmNlKSB7XG4gIHtcbiAgICBpZiAoc291cmNlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhciBmaWxlTmFtZSA9IHNvdXJjZS5maWxlTmFtZS5yZXBsYWNlKC9eLipbXFxcXFxcL10vLCAnJyk7XG4gICAgICB2YXIgbGluZU51bWJlciA9IHNvdXJjZS5saW5lTnVtYmVyO1xuICAgICAgcmV0dXJuICdcXG5cXG5DaGVjayB5b3VyIGNvZGUgYXQgJyArIGZpbGVOYW1lICsgJzonICsgbGluZU51bWJlciArICcuJztcbiAgICB9XG5cbiAgICByZXR1cm4gJyc7XG4gIH1cbn1cbi8qKlxuICogV2FybiBpZiB0aGVyZSdzIG5vIGtleSBleHBsaWNpdGx5IHNldCBvbiBkeW5hbWljIGFycmF5cyBvZiBjaGlsZHJlbiBvclxuICogb2JqZWN0IGtleXMgYXJlIG5vdCB2YWxpZC4gVGhpcyBhbGxvd3MgdXMgdG8ga2VlcCB0cmFjayBvZiBjaGlsZHJlbiBiZXR3ZWVuXG4gKiB1cGRhdGVzLlxuICovXG5cblxudmFyIG93bmVySGFzS2V5VXNlV2FybmluZyA9IHt9O1xuXG5mdW5jdGlvbiBnZXRDdXJyZW50Q29tcG9uZW50RXJyb3JJbmZvKHBhcmVudFR5cGUpIHtcbiAge1xuICAgIHZhciBpbmZvID0gZ2V0RGVjbGFyYXRpb25FcnJvckFkZGVuZHVtKCk7XG5cbiAgICBpZiAoIWluZm8pIHtcbiAgICAgIHZhciBwYXJlbnROYW1lID0gdHlwZW9mIHBhcmVudFR5cGUgPT09ICdzdHJpbmcnID8gcGFyZW50VHlwZSA6IHBhcmVudFR5cGUuZGlzcGxheU5hbWUgfHwgcGFyZW50VHlwZS5uYW1lO1xuXG4gICAgICBpZiAocGFyZW50TmFtZSkge1xuICAgICAgICBpbmZvID0gXCJcXG5cXG5DaGVjayB0aGUgdG9wLWxldmVsIHJlbmRlciBjYWxsIHVzaW5nIDxcIiArIHBhcmVudE5hbWUgKyBcIj4uXCI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGluZm87XG4gIH1cbn1cbi8qKlxuICogV2FybiBpZiB0aGUgZWxlbWVudCBkb2Vzbid0IGhhdmUgYW4gZXhwbGljaXQga2V5IGFzc2lnbmVkIHRvIGl0LlxuICogVGhpcyBlbGVtZW50IGlzIGluIGFuIGFycmF5LiBUaGUgYXJyYXkgY291bGQgZ3JvdyBhbmQgc2hyaW5rIG9yIGJlXG4gKiByZW9yZGVyZWQuIEFsbCBjaGlsZHJlbiB0aGF0IGhhdmVuJ3QgYWxyZWFkeSBiZWVuIHZhbGlkYXRlZCBhcmUgcmVxdWlyZWQgdG9cbiAqIGhhdmUgYSBcImtleVwiIHByb3BlcnR5IGFzc2lnbmVkIHRvIGl0LiBFcnJvciBzdGF0dXNlcyBhcmUgY2FjaGVkIHNvIGEgd2FybmluZ1xuICogd2lsbCBvbmx5IGJlIHNob3duIG9uY2UuXG4gKlxuICogQGludGVybmFsXG4gKiBAcGFyYW0ge1JlYWN0RWxlbWVudH0gZWxlbWVudCBFbGVtZW50IHRoYXQgcmVxdWlyZXMgYSBrZXkuXG4gKiBAcGFyYW0geyp9IHBhcmVudFR5cGUgZWxlbWVudCdzIHBhcmVudCdzIHR5cGUuXG4gKi9cblxuXG5mdW5jdGlvbiB2YWxpZGF0ZUV4cGxpY2l0S2V5KGVsZW1lbnQsIHBhcmVudFR5cGUpIHtcbiAge1xuICAgIGlmICghZWxlbWVudC5fc3RvcmUgfHwgZWxlbWVudC5fc3RvcmUudmFsaWRhdGVkIHx8IGVsZW1lbnQua2V5ICE9IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBlbGVtZW50Ll9zdG9yZS52YWxpZGF0ZWQgPSB0cnVlO1xuICAgIHZhciBjdXJyZW50Q29tcG9uZW50RXJyb3JJbmZvID0gZ2V0Q3VycmVudENvbXBvbmVudEVycm9ySW5mbyhwYXJlbnRUeXBlKTtcblxuICAgIGlmIChvd25lckhhc0tleVVzZVdhcm5pbmdbY3VycmVudENvbXBvbmVudEVycm9ySW5mb10pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBvd25lckhhc0tleVVzZVdhcm5pbmdbY3VycmVudENvbXBvbmVudEVycm9ySW5mb10gPSB0cnVlOyAvLyBVc3VhbGx5IHRoZSBjdXJyZW50IG93bmVyIGlzIHRoZSBvZmZlbmRlciwgYnV0IGlmIGl0IGFjY2VwdHMgY2hpbGRyZW4gYXMgYVxuICAgIC8vIHByb3BlcnR5LCBpdCBtYXkgYmUgdGhlIGNyZWF0b3Igb2YgdGhlIGNoaWxkIHRoYXQncyByZXNwb25zaWJsZSBmb3JcbiAgICAvLyBhc3NpZ25pbmcgaXQgYSBrZXkuXG5cbiAgICB2YXIgY2hpbGRPd25lciA9ICcnO1xuXG4gICAgaWYgKGVsZW1lbnQgJiYgZWxlbWVudC5fb3duZXIgJiYgZWxlbWVudC5fb3duZXIgIT09IFJlYWN0Q3VycmVudE93bmVyJDEuY3VycmVudCkge1xuICAgICAgLy8gR2l2ZSB0aGUgY29tcG9uZW50IHRoYXQgb3JpZ2luYWxseSBjcmVhdGVkIHRoaXMgY2hpbGQuXG4gICAgICBjaGlsZE93bmVyID0gXCIgSXQgd2FzIHBhc3NlZCBhIGNoaWxkIGZyb20gXCIgKyBnZXRDb21wb25lbnROYW1lRnJvbVR5cGUoZWxlbWVudC5fb3duZXIudHlwZSkgKyBcIi5cIjtcbiAgICB9XG5cbiAgICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudCQxKGVsZW1lbnQpO1xuXG4gICAgZXJyb3IoJ0VhY2ggY2hpbGQgaW4gYSBsaXN0IHNob3VsZCBoYXZlIGEgdW5pcXVlIFwia2V5XCIgcHJvcC4nICsgJyVzJXMgU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvbGluay93YXJuaW5nLWtleXMgZm9yIG1vcmUgaW5mb3JtYXRpb24uJywgY3VycmVudENvbXBvbmVudEVycm9ySW5mbywgY2hpbGRPd25lcik7XG5cbiAgICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudCQxKG51bGwpO1xuICB9XG59XG4vKipcbiAqIEVuc3VyZSB0aGF0IGV2ZXJ5IGVsZW1lbnQgZWl0aGVyIGlzIHBhc3NlZCBpbiBhIHN0YXRpYyBsb2NhdGlvbiwgaW4gYW5cbiAqIGFycmF5IHdpdGggYW4gZXhwbGljaXQga2V5cyBwcm9wZXJ0eSBkZWZpbmVkLCBvciBpbiBhbiBvYmplY3QgbGl0ZXJhbFxuICogd2l0aCB2YWxpZCBrZXkgcHJvcGVydHkuXG4gKlxuICogQGludGVybmFsXG4gKiBAcGFyYW0ge1JlYWN0Tm9kZX0gbm9kZSBTdGF0aWNhbGx5IHBhc3NlZCBjaGlsZCBvZiBhbnkgdHlwZS5cbiAqIEBwYXJhbSB7Kn0gcGFyZW50VHlwZSBub2RlJ3MgcGFyZW50J3MgdHlwZS5cbiAqL1xuXG5cbmZ1bmN0aW9uIHZhbGlkYXRlQ2hpbGRLZXlzKG5vZGUsIHBhcmVudFR5cGUpIHtcbiAge1xuICAgIGlmICh0eXBlb2Ygbm9kZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoaXNBcnJheShub2RlKSkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjaGlsZCA9IG5vZGVbaV07XG5cbiAgICAgICAgaWYgKGlzVmFsaWRFbGVtZW50KGNoaWxkKSkge1xuICAgICAgICAgIHZhbGlkYXRlRXhwbGljaXRLZXkoY2hpbGQsIHBhcmVudFR5cGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChpc1ZhbGlkRWxlbWVudChub2RlKSkge1xuICAgICAgLy8gVGhpcyBlbGVtZW50IHdhcyBwYXNzZWQgaW4gYSB2YWxpZCBsb2NhdGlvbi5cbiAgICAgIGlmIChub2RlLl9zdG9yZSkge1xuICAgICAgICBub2RlLl9zdG9yZS52YWxpZGF0ZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobm9kZSkge1xuICAgICAgdmFyIGl0ZXJhdG9yRm4gPSBnZXRJdGVyYXRvckZuKG5vZGUpO1xuXG4gICAgICBpZiAodHlwZW9mIGl0ZXJhdG9yRm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gRW50cnkgaXRlcmF0b3JzIHVzZWQgdG8gcHJvdmlkZSBpbXBsaWNpdCBrZXlzLFxuICAgICAgICAvLyBidXQgbm93IHdlIHByaW50IGEgc2VwYXJhdGUgd2FybmluZyBmb3IgdGhlbSBsYXRlci5cbiAgICAgICAgaWYgKGl0ZXJhdG9yRm4gIT09IG5vZGUuZW50cmllcykge1xuICAgICAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhdG9yRm4uY2FsbChub2RlKTtcbiAgICAgICAgICB2YXIgc3RlcDtcblxuICAgICAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgICAgIGlmIChpc1ZhbGlkRWxlbWVudChzdGVwLnZhbHVlKSkge1xuICAgICAgICAgICAgICB2YWxpZGF0ZUV4cGxpY2l0S2V5KHN0ZXAudmFsdWUsIHBhcmVudFR5cGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuLyoqXG4gKiBHaXZlbiBhbiBlbGVtZW50LCB2YWxpZGF0ZSB0aGF0IGl0cyBwcm9wcyBmb2xsb3cgdGhlIHByb3BUeXBlcyBkZWZpbml0aW9uLFxuICogcHJvdmlkZWQgYnkgdGhlIHR5cGUuXG4gKlxuICogQHBhcmFtIHtSZWFjdEVsZW1lbnR9IGVsZW1lbnRcbiAqL1xuXG5cbmZ1bmN0aW9uIHZhbGlkYXRlUHJvcFR5cGVzKGVsZW1lbnQpIHtcbiAge1xuICAgIHZhciB0eXBlID0gZWxlbWVudC50eXBlO1xuXG4gICAgaWYgKHR5cGUgPT09IG51bGwgfHwgdHlwZSA9PT0gdW5kZWZpbmVkIHx8IHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBwcm9wVHlwZXM7XG5cbiAgICBpZiAodHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHByb3BUeXBlcyA9IHR5cGUucHJvcFR5cGVzO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHR5cGUgPT09ICdvYmplY3QnICYmICh0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFIHx8IC8vIE5vdGU6IE1lbW8gb25seSBjaGVja3Mgb3V0ZXIgcHJvcHMgaGVyZS5cbiAgICAvLyBJbm5lciBwcm9wcyBhcmUgY2hlY2tlZCBpbiB0aGUgcmVjb25jaWxlci5cbiAgICB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9NRU1PX1RZUEUpKSB7XG4gICAgICBwcm9wVHlwZXMgPSB0eXBlLnByb3BUeXBlcztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChwcm9wVHlwZXMpIHtcbiAgICAgIC8vIEludGVudGlvbmFsbHkgaW5zaWRlIHRvIGF2b2lkIHRyaWdnZXJpbmcgbGF6eSBpbml0aWFsaXplcnM6XG4gICAgICB2YXIgbmFtZSA9IGdldENvbXBvbmVudE5hbWVGcm9tVHlwZSh0eXBlKTtcbiAgICAgIGNoZWNrUHJvcFR5cGVzKHByb3BUeXBlcywgZWxlbWVudC5wcm9wcywgJ3Byb3AnLCBuYW1lLCBlbGVtZW50KTtcbiAgICB9IGVsc2UgaWYgKHR5cGUuUHJvcFR5cGVzICE9PSB1bmRlZmluZWQgJiYgIXByb3BUeXBlc01pc3NwZWxsV2FybmluZ1Nob3duKSB7XG4gICAgICBwcm9wVHlwZXNNaXNzcGVsbFdhcm5pbmdTaG93biA9IHRydWU7IC8vIEludGVudGlvbmFsbHkgaW5zaWRlIHRvIGF2b2lkIHRyaWdnZXJpbmcgbGF6eSBpbml0aWFsaXplcnM6XG5cbiAgICAgIHZhciBfbmFtZSA9IGdldENvbXBvbmVudE5hbWVGcm9tVHlwZSh0eXBlKTtcblxuICAgICAgZXJyb3IoJ0NvbXBvbmVudCAlcyBkZWNsYXJlZCBgUHJvcFR5cGVzYCBpbnN0ZWFkIG9mIGBwcm9wVHlwZXNgLiBEaWQgeW91IG1pc3NwZWxsIHRoZSBwcm9wZXJ0eSBhc3NpZ25tZW50PycsIF9uYW1lIHx8ICdVbmtub3duJyk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB0eXBlLmdldERlZmF1bHRQcm9wcyA9PT0gJ2Z1bmN0aW9uJyAmJiAhdHlwZS5nZXREZWZhdWx0UHJvcHMuaXNSZWFjdENsYXNzQXBwcm92ZWQpIHtcbiAgICAgIGVycm9yKCdnZXREZWZhdWx0UHJvcHMgaXMgb25seSB1c2VkIG9uIGNsYXNzaWMgUmVhY3QuY3JlYXRlQ2xhc3MgJyArICdkZWZpbml0aW9ucy4gVXNlIGEgc3RhdGljIHByb3BlcnR5IG5hbWVkIGBkZWZhdWx0UHJvcHNgIGluc3RlYWQuJyk7XG4gICAgfVxuICB9XG59XG4vKipcbiAqIEdpdmVuIGEgZnJhZ21lbnQsIHZhbGlkYXRlIHRoYXQgaXQgY2FuIG9ubHkgYmUgcHJvdmlkZWQgd2l0aCBmcmFnbWVudCBwcm9wc1xuICogQHBhcmFtIHtSZWFjdEVsZW1lbnR9IGZyYWdtZW50XG4gKi9cblxuXG5mdW5jdGlvbiB2YWxpZGF0ZUZyYWdtZW50UHJvcHMoZnJhZ21lbnQpIHtcbiAge1xuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoZnJhZ21lbnQucHJvcHMpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tpXTtcblxuICAgICAgaWYgKGtleSAhPT0gJ2NoaWxkcmVuJyAmJiBrZXkgIT09ICdrZXknKSB7XG4gICAgICAgIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50JDEoZnJhZ21lbnQpO1xuXG4gICAgICAgIGVycm9yKCdJbnZhbGlkIHByb3AgYCVzYCBzdXBwbGllZCB0byBgUmVhY3QuRnJhZ21lbnRgLiAnICsgJ1JlYWN0LkZyYWdtZW50IGNhbiBvbmx5IGhhdmUgYGtleWAgYW5kIGBjaGlsZHJlbmAgcHJvcHMuJywga2V5KTtcblxuICAgICAgICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudCQxKG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZnJhZ21lbnQucmVmICE9PSBudWxsKSB7XG4gICAgICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudCQxKGZyYWdtZW50KTtcblxuICAgICAgZXJyb3IoJ0ludmFsaWQgYXR0cmlidXRlIGByZWZgIHN1cHBsaWVkIHRvIGBSZWFjdC5GcmFnbWVudGAuJyk7XG5cbiAgICAgIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50JDEobnVsbCk7XG4gICAgfVxuICB9XG59XG5cbnZhciBkaWRXYXJuQWJvdXRLZXlTcHJlYWQgPSB7fTtcbmZ1bmN0aW9uIGpzeFdpdGhWYWxpZGF0aW9uKHR5cGUsIHByb3BzLCBrZXksIGlzU3RhdGljQ2hpbGRyZW4sIHNvdXJjZSwgc2VsZikge1xuICB7XG4gICAgdmFyIHZhbGlkVHlwZSA9IGlzVmFsaWRFbGVtZW50VHlwZSh0eXBlKTsgLy8gV2Ugd2FybiBpbiB0aGlzIGNhc2UgYnV0IGRvbid0IHRocm93LiBXZSBleHBlY3QgdGhlIGVsZW1lbnQgY3JlYXRpb24gdG9cbiAgICAvLyBzdWNjZWVkIGFuZCB0aGVyZSB3aWxsIGxpa2VseSBiZSBlcnJvcnMgaW4gcmVuZGVyLlxuXG4gICAgaWYgKCF2YWxpZFR5cGUpIHtcbiAgICAgIHZhciBpbmZvID0gJyc7XG5cbiAgICAgIGlmICh0eXBlID09PSB1bmRlZmluZWQgfHwgdHlwZW9mIHR5cGUgPT09ICdvYmplY3QnICYmIHR5cGUgIT09IG51bGwgJiYgT2JqZWN0LmtleXModHlwZSkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGluZm8gKz0gJyBZb3UgbGlrZWx5IGZvcmdvdCB0byBleHBvcnQgeW91ciBjb21wb25lbnQgZnJvbSB0aGUgZmlsZSAnICsgXCJpdCdzIGRlZmluZWQgaW4sIG9yIHlvdSBtaWdodCBoYXZlIG1peGVkIHVwIGRlZmF1bHQgYW5kIG5hbWVkIGltcG9ydHMuXCI7XG4gICAgICB9XG5cbiAgICAgIHZhciBzb3VyY2VJbmZvID0gZ2V0U291cmNlSW5mb0Vycm9yQWRkZW5kdW0oc291cmNlKTtcblxuICAgICAgaWYgKHNvdXJjZUluZm8pIHtcbiAgICAgICAgaW5mbyArPSBzb3VyY2VJbmZvO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5mbyArPSBnZXREZWNsYXJhdGlvbkVycm9yQWRkZW5kdW0oKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHR5cGVTdHJpbmc7XG5cbiAgICAgIGlmICh0eXBlID09PSBudWxsKSB7XG4gICAgICAgIHR5cGVTdHJpbmcgPSAnbnVsbCc7XG4gICAgICB9IGVsc2UgaWYgKGlzQXJyYXkodHlwZSkpIHtcbiAgICAgICAgdHlwZVN0cmluZyA9ICdhcnJheSc7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgIT09IHVuZGVmaW5lZCAmJiB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9FTEVNRU5UX1RZUEUpIHtcbiAgICAgICAgdHlwZVN0cmluZyA9IFwiPFwiICsgKGdldENvbXBvbmVudE5hbWVGcm9tVHlwZSh0eXBlLnR5cGUpIHx8ICdVbmtub3duJykgKyBcIiAvPlwiO1xuICAgICAgICBpbmZvID0gJyBEaWQgeW91IGFjY2lkZW50YWxseSBleHBvcnQgYSBKU1ggbGl0ZXJhbCBpbnN0ZWFkIG9mIGEgY29tcG9uZW50Pyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0eXBlU3RyaW5nID0gdHlwZW9mIHR5cGU7XG4gICAgICB9XG5cbiAgICAgIGVycm9yKCdSZWFjdC5qc3g6IHR5cGUgaXMgaW52YWxpZCAtLSBleHBlY3RlZCBhIHN0cmluZyAoZm9yICcgKyAnYnVpbHQtaW4gY29tcG9uZW50cykgb3IgYSBjbGFzcy9mdW5jdGlvbiAoZm9yIGNvbXBvc2l0ZSAnICsgJ2NvbXBvbmVudHMpIGJ1dCBnb3Q6ICVzLiVzJywgdHlwZVN0cmluZywgaW5mbyk7XG4gICAgfVxuXG4gICAgdmFyIGVsZW1lbnQgPSBqc3hERVYodHlwZSwgcHJvcHMsIGtleSwgc291cmNlLCBzZWxmKTsgLy8gVGhlIHJlc3VsdCBjYW4gYmUgbnVsbGlzaCBpZiBhIG1vY2sgb3IgYSBjdXN0b20gZnVuY3Rpb24gaXMgdXNlZC5cbiAgICAvLyBUT0RPOiBEcm9wIHRoaXMgd2hlbiB0aGVzZSBhcmUgbm8gbG9uZ2VyIGFsbG93ZWQgYXMgdGhlIHR5cGUgYXJndW1lbnQuXG5cbiAgICBpZiAoZWxlbWVudCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9IC8vIFNraXAga2V5IHdhcm5pbmcgaWYgdGhlIHR5cGUgaXNuJ3QgdmFsaWQgc2luY2Ugb3VyIGtleSB2YWxpZGF0aW9uIGxvZ2ljXG4gICAgLy8gZG9lc24ndCBleHBlY3QgYSBub24tc3RyaW5nL2Z1bmN0aW9uIHR5cGUgYW5kIGNhbiB0aHJvdyBjb25mdXNpbmcgZXJyb3JzLlxuICAgIC8vIFdlIGRvbid0IHdhbnQgZXhjZXB0aW9uIGJlaGF2aW9yIHRvIGRpZmZlciBiZXR3ZWVuIGRldiBhbmQgcHJvZC5cbiAgICAvLyAoUmVuZGVyaW5nIHdpbGwgdGhyb3cgd2l0aCBhIGhlbHBmdWwgbWVzc2FnZSBhbmQgYXMgc29vbiBhcyB0aGUgdHlwZSBpc1xuICAgIC8vIGZpeGVkLCB0aGUga2V5IHdhcm5pbmdzIHdpbGwgYXBwZWFyLilcblxuXG4gICAgaWYgKHZhbGlkVHlwZSkge1xuICAgICAgdmFyIGNoaWxkcmVuID0gcHJvcHMuY2hpbGRyZW47XG5cbiAgICAgIGlmIChjaGlsZHJlbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChpc1N0YXRpY0NoaWxkcmVuKSB7XG4gICAgICAgICAgaWYgKGlzQXJyYXkoY2hpbGRyZW4pKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIHZhbGlkYXRlQ2hpbGRLZXlzKGNoaWxkcmVuW2ldLCB0eXBlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKE9iamVjdC5mcmVlemUpIHtcbiAgICAgICAgICAgICAgT2JqZWN0LmZyZWV6ZShjaGlsZHJlbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVycm9yKCdSZWFjdC5qc3g6IFN0YXRpYyBjaGlsZHJlbiBzaG91bGQgYWx3YXlzIGJlIGFuIGFycmF5LiAnICsgJ1lvdSBhcmUgbGlrZWx5IGV4cGxpY2l0bHkgY2FsbGluZyBSZWFjdC5qc3hzIG9yIFJlYWN0LmpzeERFVi4gJyArICdVc2UgdGhlIEJhYmVsIHRyYW5zZm9ybSBpbnN0ZWFkLicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWxpZGF0ZUNoaWxkS2V5cyhjaGlsZHJlbiwgdHlwZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB7XG4gICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChwcm9wcywgJ2tleScpKSB7XG4gICAgICAgIHZhciBjb21wb25lbnROYW1lID0gZ2V0Q29tcG9uZW50TmFtZUZyb21UeXBlKHR5cGUpO1xuICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHByb3BzKS5maWx0ZXIoZnVuY3Rpb24gKGspIHtcbiAgICAgICAgICByZXR1cm4gayAhPT0gJ2tleSc7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgYmVmb3JlRXhhbXBsZSA9IGtleXMubGVuZ3RoID4gMCA/ICd7a2V5OiBzb21lS2V5LCAnICsga2V5cy5qb2luKCc6IC4uLiwgJykgKyAnOiAuLi59JyA6ICd7a2V5OiBzb21lS2V5fSc7XG5cbiAgICAgICAgaWYgKCFkaWRXYXJuQWJvdXRLZXlTcHJlYWRbY29tcG9uZW50TmFtZSArIGJlZm9yZUV4YW1wbGVdKSB7XG4gICAgICAgICAgdmFyIGFmdGVyRXhhbXBsZSA9IGtleXMubGVuZ3RoID4gMCA/ICd7JyArIGtleXMuam9pbignOiAuLi4sICcpICsgJzogLi4ufScgOiAne30nO1xuXG4gICAgICAgICAgZXJyb3IoJ0EgcHJvcHMgb2JqZWN0IGNvbnRhaW5pbmcgYSBcImtleVwiIHByb3AgaXMgYmVpbmcgc3ByZWFkIGludG8gSlNYOlxcbicgKyAnICBsZXQgcHJvcHMgPSAlcztcXG4nICsgJyAgPCVzIHsuLi5wcm9wc30gLz5cXG4nICsgJ1JlYWN0IGtleXMgbXVzdCBiZSBwYXNzZWQgZGlyZWN0bHkgdG8gSlNYIHdpdGhvdXQgdXNpbmcgc3ByZWFkOlxcbicgKyAnICBsZXQgcHJvcHMgPSAlcztcXG4nICsgJyAgPCVzIGtleT17c29tZUtleX0gey4uLnByb3BzfSAvPicsIGJlZm9yZUV4YW1wbGUsIGNvbXBvbmVudE5hbWUsIGFmdGVyRXhhbXBsZSwgY29tcG9uZW50TmFtZSk7XG5cbiAgICAgICAgICBkaWRXYXJuQWJvdXRLZXlTcHJlYWRbY29tcG9uZW50TmFtZSArIGJlZm9yZUV4YW1wbGVdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0eXBlID09PSBSRUFDVF9GUkFHTUVOVF9UWVBFKSB7XG4gICAgICB2YWxpZGF0ZUZyYWdtZW50UHJvcHMoZWxlbWVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbGlkYXRlUHJvcFR5cGVzKGVsZW1lbnQpO1xuICAgIH1cblxuICAgIHJldHVybiBlbGVtZW50O1xuICB9XG59IC8vIFRoZXNlIHR3byBmdW5jdGlvbnMgZXhpc3QgdG8gc3RpbGwgZ2V0IGNoaWxkIHdhcm5pbmdzIGluIGRldlxuLy8gZXZlbiB3aXRoIHRoZSBwcm9kIHRyYW5zZm9ybS4gVGhpcyBtZWFucyB0aGF0IGpzeERFViBpcyBwdXJlbHlcbi8vIG9wdC1pbiBiZWhhdmlvciBmb3IgYmV0dGVyIG1lc3NhZ2VzIGJ1dCB0aGF0IHdlIHdvbid0IHN0b3Bcbi8vIGdpdmluZyB5b3Ugd2FybmluZ3MgaWYgeW91IHVzZSBwcm9kdWN0aW9uIGFwaXMuXG5cbmZ1bmN0aW9uIGpzeFdpdGhWYWxpZGF0aW9uU3RhdGljKHR5cGUsIHByb3BzLCBrZXkpIHtcbiAge1xuICAgIHJldHVybiBqc3hXaXRoVmFsaWRhdGlvbih0eXBlLCBwcm9wcywga2V5LCB0cnVlKTtcbiAgfVxufVxuZnVuY3Rpb24ganN4V2l0aFZhbGlkYXRpb25EeW5hbWljKHR5cGUsIHByb3BzLCBrZXkpIHtcbiAge1xuICAgIHJldHVybiBqc3hXaXRoVmFsaWRhdGlvbih0eXBlLCBwcm9wcywga2V5LCBmYWxzZSk7XG4gIH1cbn1cblxudmFyIGpzeCA9ICBqc3hXaXRoVmFsaWRhdGlvbkR5bmFtaWMgOyAvLyB3ZSBtYXkgd2FudCB0byBzcGVjaWFsIGNhc2UganN4cyBpbnRlcm5hbGx5IHRvIHRha2UgYWR2YW50YWdlIG9mIHN0YXRpYyBjaGlsZHJlbi5cbi8vIGZvciBub3cgd2UgY2FuIHNoaXAgaWRlbnRpY2FsIHByb2QgZnVuY3Rpb25zXG5cbnZhciBqc3hzID0gIGpzeFdpdGhWYWxpZGF0aW9uU3RhdGljIDtcblxuZXhwb3J0cy5GcmFnbWVudCA9IFJFQUNUX0ZSQUdNRU5UX1RZUEU7XG5leHBvcnRzLmpzeCA9IGpzeDtcbmV4cG9ydHMuanN4cyA9IGpzeHM7XG4gIH0pKCk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9janMvcmVhY3QtanN4LXJ1bnRpbWUucHJvZHVjdGlvbi5taW4uanMnKTtcbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9janMvcmVhY3QtanN4LXJ1bnRpbWUuZGV2ZWxvcG1lbnQuanMnKTtcbn1cbiIsImltcG9ydCB7IGpzeCBhcyBfanN4IH0gZnJvbSBcInJlYWN0L2pzeC1ydW50aW1lXCI7XG5pbXBvcnQgeyBjcmVhdGVSZW1vdGVSZWFjdENvbXBvbmVudCB9IGZyb20gJ0ByZW1vdGUtdWkvcmVhY3QnO1xuZXhwb3J0IGNvbnN0IGNyZWF0ZVJlbW90ZUNvbXBvbmVudFJlZ2lzdHJ5ID0gKCkgPT4ge1xuICAgIGNvbnN0IGNvbXBvbmVudE1ldGFkYXRhTG9va3VwID0gbmV3IE1hcCgpO1xuICAgIGNvbnN0IGNvbXBvbmVudE5hbWVCeUNvbXBvbmVudE1hcCA9IG5ldyBNYXAoKTtcbiAgICBjb25zdCByZWdpc3RlckNvbXBvbmVudCA9IChjb21wb25lbnQsIGNvbXBvbmVudE5hbWUsIGZyYWdtZW50UHJvcHMpID0+IHtcbiAgICAgICAgY29tcG9uZW50TmFtZUJ5Q29tcG9uZW50TWFwLnNldChjb21wb25lbnQsIGNvbXBvbmVudE5hbWUpO1xuICAgICAgICBjb21wb25lbnRNZXRhZGF0YUxvb2t1cC5zZXQoY29tcG9uZW50TmFtZSwge1xuICAgICAgICAgICAgZnJhZ21lbnRQcm9wc1NldDogbmV3IFNldChmcmFnbWVudFByb3BzKSxcbiAgICAgICAgICAgIGZyYWdtZW50UHJvcHNBcnJheTogZnJhZ21lbnRQcm9wcyxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBjb21wb25lbnQ7XG4gICAgfTtcbiAgICByZXR1cm4ge1xuICAgICAgICBnZXRDb21wb25lbnROYW1lOiAoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb21wb25lbnROYW1lID0gY29tcG9uZW50TmFtZUJ5Q29tcG9uZW50TWFwLmdldChjb21wb25lbnQpO1xuICAgICAgICAgICAgaWYgKCFjb21wb25lbnROYW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY29tcG9uZW50TmFtZTtcbiAgICAgICAgfSxcbiAgICAgICAgaXNBbGxvd2VkQ29tcG9uZW50TmFtZTogKGNvbXBvbmVudE5hbWUpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBjb21wb25lbnRNZXRhZGF0YUxvb2t1cC5oYXMoY29tcG9uZW50TmFtZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGlzQ29tcG9uZW50RnJhZ21lbnRQcm9wOiAoY29tcG9uZW50TmFtZSwgcHJvcE5hbWUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudE1ldGFkYXRhID0gY29tcG9uZW50TWV0YWRhdGFMb29rdXAuZ2V0KGNvbXBvbmVudE5hbWUpO1xuICAgICAgICAgICAgaWYgKCFjb21wb25lbnRNZXRhZGF0YSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjb21wb25lbnRNZXRhZGF0YS5mcmFnbWVudFByb3BzU2V0Lmhhcyhwcm9wTmFtZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGdldENvbXBvbmVudEZyYWdtZW50UHJvcE5hbWVzOiAoY29tcG9uZW50TmFtZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY29tcG9uZW50TWV0YWRhdGEgPSBjb21wb25lbnRNZXRhZGF0YUxvb2t1cC5nZXQoY29tcG9uZW50TmFtZSk7XG4gICAgICAgICAgICBpZiAoIWNvbXBvbmVudE1ldGFkYXRhKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgeyBmcmFnbWVudFByb3BzQXJyYXkgfSA9IGNvbXBvbmVudE1ldGFkYXRhO1xuICAgICAgICAgICAgcmV0dXJuIGZyYWdtZW50UHJvcHNBcnJheTtcbiAgICAgICAgfSxcbiAgICAgICAgY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudDogKGNvbXBvbmVudE5hbWUsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyBmcmFnbWVudFByb3BzID0gW10gfSA9IG9wdGlvbnM7XG4gICAgICAgICAgICBjb25zdCByZW1vdGVSZWFjdENvbXBvbmVudCA9IGNyZWF0ZVJlbW90ZVJlYWN0Q29tcG9uZW50KGNvbXBvbmVudE5hbWUsIHtcbiAgICAgICAgICAgICAgICBmcmFnbWVudFByb3BzOiBmcmFnbWVudFByb3BzLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcmVnaXN0ZXJDb21wb25lbnQocmVtb3RlUmVhY3RDb21wb25lbnQsIGNvbXBvbmVudE5hbWUsIGZyYWdtZW50UHJvcHMpO1xuICAgICAgICB9LFxuICAgICAgICBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZUNvbXBvdW5kUmVhY3RDb21wb25lbnQ6IChjb21wb25lbnROYW1lLCBvcHRpb25zKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IGZyYWdtZW50UHJvcHMgPSBbXSB9ID0gb3B0aW9ucztcbiAgICAgICAgICAgIGNvbnN0IFJlbW90ZUNvbXBvbmVudFR5cGUgPSBjcmVhdGVSZW1vdGVSZWFjdENvbXBvbmVudChjb21wb25lbnROYW1lLCB7XG4gICAgICAgICAgICAgICAgZnJhZ21lbnRQcm9wcyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gV2UgY2FuIG9ubHkgYXR0YWNoIHByb3BlcnRpZXMgdG8gYSBmdW5jdGlvbiBjb21wb25lbnQgdHlwZSwgc28gd2UgbmVlZCB0byBjaGVjayBpZiB0aGUgcmVtb3RlIGNvbXBvbmVudCB0eXBlIGlzIGEgZnVuY3Rpb24uXG4gICAgICAgICAgICAvLyBJZiB0aGUgcmVtb3RlIGNvbXBvbmVudCB0eXBlIGlzIG5vdCBhIGZ1bmN0aW9uLCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSBmdW5jdGlvbiBjb21wb25lbnQuXG4gICAgICAgICAgICBjb25zdCBDb21wb3VuZEZ1bmN0aW9uQ29tcG9uZW50VHlwZSA9IHR5cGVvZiBSZW1vdGVDb21wb25lbnRUeXBlID09PSAnZnVuY3Rpb24nXG4gICAgICAgICAgICAgICAgPyBSZW1vdGVDb21wb25lbnRUeXBlXG4gICAgICAgICAgICAgICAgOiAocHJvcHMpID0+IChfanN4KFJlbW90ZUNvbXBvbmVudFR5cGUsIHsgLi4ucHJvcHMgfSkpO1xuICAgICAgICAgICAgLy8gQXR0YWNoIHRoZSBjb21wb3VuZCBjb21wb25lbnQgcHJvcGVydGllcyB0byB0aGUgZnVuY3Rpb24gY29tcG9uZW50IHRoYXQgd2Ugd2lsbCBiZSByZXR1cm5pbmcuXG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKENvbXBvdW5kRnVuY3Rpb25Db21wb25lbnRUeXBlLCBvcHRpb25zLmNvbXBvdW5kQ29tcG9uZW50UHJvcGVydGllcyk7XG4gICAgICAgICAgICAvLyBSZWdpc3RlciB0aGUgY29tcG91bmQgZnVuY3Rpb24gY29tcG9uZW50IHdpdGggdGhlIHJlZ2lzdHJ5IGFuZCByZXR1cm4gaXQuXG4gICAgICAgICAgICByZXR1cm4gcmVnaXN0ZXJDb21wb25lbnQoQ29tcG91bmRGdW5jdGlvbkNvbXBvbmVudFR5cGUsIGNvbXBvbmVudE5hbWUsIGZyYWdtZW50UHJvcHMpO1xuICAgICAgICB9LFxuICAgIH07XG59O1xuIiwiaW1wb3J0IHsgY3JlYXRlUmVtb3RlQ29tcG9uZW50UmVnaXN0cnkgfSBmcm9tIFwiLi91dGlscy9yZW1vdGUtY29tcG9uZW50LXJlZ2lzdHJ5LmpzXCI7XG4vKipcbiAqIFJlcHJlc2VudHMgYSByZWdpc3RyeSBvZiBIdWJTcG90LXByb3ZpZGVkIFJlYWN0IGNvbXBvbmVudHMgdGhhdCBzaG91bGQgb25seSBiZSB1c2VkICoqaW50ZXJuYWxseSoqIGJ5IHRoZSBVSSBleHRlbnNpb24gU0RLLlxuICpcbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgY29uc3QgX19odWJTcG90Q29tcG9uZW50UmVnaXN0cnkgPSBjcmVhdGVSZW1vdGVDb21wb25lbnRSZWdpc3RyeSgpO1xuY29uc3QgeyBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50LCBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZUNvbXBvdW5kUmVhY3RDb21wb25lbnQsIH0gPSBfX2h1YlNwb3RDb21wb25lbnRSZWdpc3RyeTtcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gU1RBTkRBUkQgQ09NUE9ORU5UU1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vKipcbiAqIFRoZSBgQWxlcnRgIGNvbXBvbmVudCByZW5kZXJzIGFuIGFsZXJ0IHdpdGhpbiBhIGNhcmQuIFVzZSB0aGlzIGNvbXBvbmVudCB0byBnaXZlIHVzYWdlIGd1aWRhbmNlLCBub3RpZnkgdXNlcnMgb2YgYWN0aW9uIHJlc3VsdHMsIG9yIHdhcm4gdGhlbSBhYm91dCBwb3RlbnRpYWwgaXNzdWVzIG9yIGZhaWx1cmVzLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL2FsZXJ0IERvY3N9XG4gKiAtIHtAbGluayBodHRwczovL2FwcC5odWJzcG90LmNvbS9kb2NzLzQ4MDA4OTE2L3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvYWxlcnQjdmFyaWFudHMgVmFyaWFudHN9XG4gKi9cbmV4cG9ydCBjb25zdCBBbGVydCA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0FsZXJ0Jyk7XG4vKipcbiAqIFRoZSBgQnV0dG9uYCBjb21wb25lbnQgcmVuZGVycyBhIHNpbmdsZSBidXR0b24uIFVzZSB0aGlzIGNvbXBvbmVudCB0byBlbmFibGUgdXNlcnMgdG8gcGVyZm9ybSBhY3Rpb25zLCBzdWNoIGFzIHN1Ym1pdHRpbmcgYSBmb3JtLCBzZW5kaW5nIGRhdGEgdG8gYW4gZXh0ZXJuYWwgc3lzdGVtLCBvciBkZWxldGluZyBkYXRhLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL2J1dHRvbiBEb2NzfVxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9idXR0b24jdXNhZ2UtZXhhbXBsZXMgRXhhbXBsZXN9XG4gKiAtIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vSHViU3BvdC91aS1leHRlbnNpb25zLWV4YW1wbGVzL3RyZWUvbWFpbi9kZXNpZ24tcGF0dGVybnMjYnV0dG9uIERlc2lnbiBQYXR0ZXJuIEV4YW1wbGVzfVxuICovXG5leHBvcnQgY29uc3QgQnV0dG9uID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnQnV0dG9uJywge1xuICAgIGZyYWdtZW50UHJvcHM6IFsnb3ZlcmxheSddLFxufSk7XG4vKipcbiAqIFRoZSBgQnV0dG9uUm93YCBjb21wb25lbnQgcmVuZGVycyBhIHJvdyBvZiBzcGVjaWZpZWQgYEJ1dHRvbmAgY29tcG9uZW50cy4gVXNlIHRoaXMgY29tcG9uZW50IHdoZW4geW91IHdhbnQgdG8gaW5jbHVkZSBtdWx0aXBsZSBidXR0b25zIGluIGEgcm93LlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL2J1dHRvbi1yb3cgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IEJ1dHRvblJvdyA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0J1dHRvblJvdycpO1xuZXhwb3J0IGNvbnN0IENhcmQgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdDYXJkJyk7XG4vKipcbiAqIFRoZSBgRGVzY3JpcHRpb25MaXN0YCBjb21wb25lbnQgcmVuZGVycyBwYWlycyBvZiBsYWJlbHMgYW5kIHZhbHVlcy4gVXNlIHRoaXMgY29tcG9uZW50IHRvIGRpc3BsYXkgcGFpcnMgb2YgbGFiZWxzIGFuZCB2YWx1ZXMgaW4gYSB3YXkgdGhhdCdzIGVhc3kgdG8gcmVhZCBhdCBhIGdsYW5jZS5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9kZXNjcmlwdGlvbi1saXN0IERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBEZXNjcmlwdGlvbkxpc3QgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdEZXNjcmlwdGlvbkxpc3QnKTtcbi8qKlxuICogVGhlIGBEZXNjcmlwdGlvbkxpc3RJdGVtYCBjb21wb25lbnQgcmVuZGVycyBhIHNpbmdsZSBzZXQgb2YgYSBsYWJlbCBhbmQgdmFsdWUuIFVzZSB0aGlzIGNvbXBvbmVudCB3aXRoaW4gYSBgRGVzY3JpcHRpb25MaXN0YCBjb21wb25lbnQuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvZGVzY3JpcHRpb24tbGlzdCBEb2NzfVxuICovXG5leHBvcnQgY29uc3QgRGVzY3JpcHRpb25MaXN0SXRlbSA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0Rlc2NyaXB0aW9uTGlzdEl0ZW0nKTtcbi8qKlxuICogVGhlIGBEaXZpZGVyYCBjb21wb25lbnQgcmVuZGVycyBhIGdyZXksIGhvcml6b250YWwgbGluZSBmb3Igc3BhY2luZyBvdXQgY29tcG9uZW50cyB2ZXJ0aWNhbGx5IG9yIGNyZWF0aW5nIHNlY3Rpb25zIGluIGFuIGV4dGVuc2lvbi4gVXNlIHRoaXMgY29tcG9uZW50IHRvIHNwYWNlIG91dCBvdGhlciBjb21wb25lbnRzIHdoZW4gdGhlIGNvbnRlbnQgbmVlZHMgbW9yZSBzZXBhcmF0aW9uIHRoYW4gd2hpdGUgc3BhY2UuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvZGl2aWRlciBEb2NzfVxuICovXG5leHBvcnQgY29uc3QgRGl2aWRlciA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0RpdmlkZXInKTtcbi8qKlxuICogVGhlIGBFbXB0eVN0YXRlYCBjb21wb25lbnQgc2V0cyB0aGUgY29udGVudCB0aGF0IGFwcGVhcnMgd2hlbiB0aGUgZXh0ZW5zaW9uIGlzIGluIGFuIGVtcHR5IHN0YXRlLiBVc2UgdGhpcyBjb21wb25lbnQgd2hlbiB0aGVyZSdzIG5vIGNvbnRlbnQgb3IgZGF0YSB0byBoZWxwIGd1aWRlIHVzZXJzLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL2VtcHR5LXN0YXRlIERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBFbXB0eVN0YXRlID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnRW1wdHlTdGF0ZScpO1xuLyoqXG4gKiBUaGUgYEVycm9yU3RhdGVgIGNvbXBvbmVudCBzZXRzIHRoZSBjb250ZW50IG9mIGFuIGVycm9yaW5nIGV4dGVuc2lvbi4gVXNlIHRoaXMgY29tcG9uZW50IHRvIGd1aWRlIHVzZXJzIHRocm91Z2ggcmVzb2x2aW5nIGVycm9ycyB0aGF0IHlvdXIgZXh0ZW5zaW9uIG1pZ2h0IGVuY291bnRlci5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9lcnJvci1zdGF0ZSBEb2NzfVxuICovXG5leHBvcnQgY29uc3QgRXJyb3JTdGF0ZSA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0Vycm9yU3RhdGUnKTtcbi8qKlxuICogVGhlIGBGb3JtYCBjb21wb25lbnQgcmVuZGVycyBhIGZvcm0gdGhhdCBjYW4gY29udGFpbiBvdGhlciBzdWJjb21wb25lbnRzLCBzdWNoIGFzIGBJbnB1dGAsIGBTZWxlY3RgLCBhbmQgYEJ1dHRvbmAuIFVzZSB0aGlzIGNvbXBvbmVudCB0byBlbmFibGUgdXNlcnMgdG8gc3VibWl0IGRhdGEgdG8gSHViU3BvdCBvciBhbiBleHRlcm5hbCBzeXN0ZW0uXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvZm9ybSBEb2NzfVxuICogLSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL0h1YlNwb3QvdWktZXh0ZW5zaW9ucy1leGFtcGxlcy90cmVlL21haW4vZGVzaWduLXBhdHRlcm5zI2Zvcm0gRGVzaWduIFBhdHRlcm4gRXhhbXBsZXN9XG4gKi9cbmV4cG9ydCBjb25zdCBGb3JtID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnRm9ybScpO1xuLyoqXG4gKiBUaGUgYEhlYWRpbmdgIGNvbXBvbmVudCByZW5kZXJzIGxhcmdlIGhlYWRpbmcgdGV4dC4gVXNlIHRoaXMgY29tcG9uZW50IHRvIGludHJvZHVjZSBvciBkaWZmZXJlbnRpYXRlIHNlY3Rpb25zIG9mIHlvdXIgY29tcG9uZW50LlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL2hlYWRpbmcgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IEhlYWRpbmcgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdIZWFkaW5nJyk7XG4vKipcbiAqIFRoZSBgSW1hZ2VgIGNvbXBvbmVudCByZW5kZXJzIGFuIGltYWdlLiBVc2UgdGhpcyBjb21wb25lbnQgdG8gYWRkIGEgbG9nbyBvciBvdGhlciB2aXN1YWwgYnJhbmQgaWRlbnRpdHkgYXNzZXQsIG9yIHRvIGFjY2VudHVhdGUgb3RoZXIgY29udGVudCBpbiB0aGUgZXh0ZW5zaW9uLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL2ltYWdlIERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBJbWFnZSA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0ltYWdlJywge1xuICAgIGZyYWdtZW50UHJvcHM6IFsnb3ZlcmxheSddLFxufSk7XG4vKipcbiAqIFRoZSBgSW5wdXRgIGNvbXBvbmVudCByZW5kZXJzIGEgdGV4dCBpbnB1dCBmaWVsZCB3aGVyZSBhIHVzZXIgY2FuIGVudGVyIGEgY3VzdG9tIHRleHQgdmFsdWUuIExpa2Ugb3RoZXIgaW5wdXRzLCB0aGlzIGNvbXBvbmVudCBzaG91bGQgYmUgdXNlZCB3aXRoaW4gYSBgRm9ybWAgdGhhdCBoYXMgYSBzdWJtaXQgYnV0dG9uLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL2lucHV0IERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBJbnB1dCA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0lucHV0Jyk7XG4vKipcbiAqIFRoZSBgTGlua2AgY29tcG9uZW50IHJlbmRlcnMgYSBjbGlja2FibGUgaHlwZXJsaW5rLiBVc2UgbGlua3MgdG8gZGlyZWN0IHVzZXJzIHRvIGFuIGV4dGVybmFsIHdlYiBwYWdlIG9yIGFub3RoZXIgcGFydCBvZiB0aGUgSHViU3BvdCBhcHAuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvbGluayBEb2NzfVxuICovXG5leHBvcnQgY29uc3QgTGluayA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0xpbmsnLCB7XG4gICAgZnJhZ21lbnRQcm9wczogWydvdmVybGF5J10sXG59KTtcbi8qKlxuICogVGhlIGBUZXh0QXJlYWAgY29tcG9uZW50IHJlbmRlcnMgYSBmaWxsYWJsZSB0ZXh0IGZpZWxkLiBMaWtlIG90aGVyIGlucHV0cywgdGhpcyBjb21wb25lbnQgc2hvdWxkIGJlIHVzZWQgd2l0aGluIGEgYEZvcm1gIHRoYXQgaGFzIGEgc3VibWl0IGJ1dHRvbi5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy90ZXh0LWFyZWEgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IFRleHRBcmVhID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnVGV4dEFyZWEnKTtcbi8vIFRleHRhcmVhIHdhcyBjaGFuZ2VkIHRvIFRleHRBcmVhXG4vLyBFeHBvcnRpbmcgYm90aCBmb3IgYmFja3dhcmRzIGNvbXBhdFxuLyoqIEBkZXByZWNhdGVkIHVzZSBUZXh0QXJlYSBpbnN0ZWFkLiBXaXRoIGEgY2FwaXRhbCBBLiovXG5leHBvcnQgY29uc3QgVGV4dGFyZWEgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdUZXh0YXJlYScpO1xuLyoqXG4gKiBUaGUgYExvYWRpbmdTcGlubmVyYCBjb21wb25lbnQgcmVuZGVycyBhIHZpc3VhbCBpbmRpY2F0b3IgZm9yIHdoZW4gYW4gZXh0ZW5zaW9uIGlzIGxvYWRpbmcgb3IgcHJvY2Vzc2luZyBkYXRhLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL2xvYWRpbmctc3Bpbm5lciBEb2NzfVxuICovXG5leHBvcnQgY29uc3QgTG9hZGluZ1NwaW5uZXIgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdMb2FkaW5nU3Bpbm5lcicpO1xuLyoqXG4gKiBUaGUgYFByb2dyZXNzQmFyYCBjb21wb25lbnQgcmVuZGVycyBhIHZpc3VhbCBpbmRpY2F0b3Igc2hvd2luZyBhIG51bWVyaWMgYW5kL29yIHBlcmNlbnRhZ2UtYmFzZWQgcmVwcmVzZW50YXRpb24gb2YgcHJvZ3Jlc3MuIFRoZSBwZXJjZW50YWdlIGlzIGNhbGN1bGF0ZWQgYmFzZWQgb24gdGhlIG1heGltdW0gcG9zc2libGUgdmFsdWUgc3BlY2lmaWVkIGluIHRoZSBjb21wb25lbnQuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvcHJvZ3Jlc3MtYmFyIERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBQcm9ncmVzc0JhciA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1Byb2dyZXNzQmFyJyk7XG4vKipcbiAqIFRoZSBgU2VsZWN0YCBjb21wb25lbnQgcmVuZGVycyBhIGRyb3Bkb3duIG1lbnUgc2VsZWN0IGZpZWxkIHdoZXJlIGEgdXNlciBjYW4gc2VsZWN0IGEgc2luZ2xlIHZhbHVlLiBBIHNlYXJjaCBiYXIgd2lsbCBiZSBhdXRvbWF0aWNhbGx5IGluY2x1ZGVkIHdoZW4gdGhlcmUgYXJlIG1vcmUgdGhhbiBzZXZlbiBvcHRpb25zLiBMaWtlIG90aGVyIGlucHV0cywgdGhpcyBjb21wb25lbnQgc2hvdWxkIGJlIHVzZWQgd2l0aGluIGEgYEZvcm1gIHRoYXQgaGFzIGEgc3VibWl0IGJ1dHRvbi5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9zZWxlY3QgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IFNlbGVjdCA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1NlbGVjdCcpO1xuLyoqXG4gKiBUaGUgYFRhZ2AgY29tcG9uZW50IHJlbmRlcnMgYSB0YWcgdG8gbGFiZWwgb3IgY2F0ZWdvcml6ZSBpbmZvcm1hdGlvbiBvciBvdGhlciBjb21wb25lbnRzLiBUYWdzIGNhbiBiZSBzdGF0aWMgb3IgY2xpY2thYmxlIGZvciBpbnZva2luZyBmdW5jdGlvbnMuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvdGFnIERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBUYWcgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdUYWcnLCB7XG4gICAgZnJhZ21lbnRQcm9wczogWydvdmVybGF5J10sXG59KTtcbi8qKlxuICogVGhlIGBUZXh0YCBjb21wb25lbnQgcmVuZGVycyB0ZXh0IHdpdGggZm9ybWF0dGluZyBvcHRpb25zLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL3RleHQgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IFRleHQgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdUZXh0Jyk7XG4vKipcbiAqIFRoZSBgVGlsZWAgY29tcG9uZW50IHJlbmRlcnMgYSBzcXVhcmUgdGlsZSB0aGF0IGNhbiBjb250YWluIG90aGVyIGNvbXBvbmVudHMuIFVzZSB0aGlzIGNvbXBvbmVudCB0byBjcmVhdGUgZ3JvdXBzIG9mIHJlbGF0ZWQgY29tcG9uZW50cy5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy90aWxlIERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBUaWxlID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnVGlsZScpO1xuLyoqIEBkZXByZWNhdGVkIHVzZSBGbGV4IGluc3RlYWQuIEl0IHdpbGwgYmUgcmVtb3ZlZCBpbiB0aGUgbmV4dCByZWxlYXNlLiAqL1xuZXhwb3J0IGNvbnN0IFN0YWNrID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnU3RhY2snKTtcbi8qKlxuICogVGhlIGBUb2dnbGVHcm91cGAgY29tcG9uZW50IHJlbmRlcnMgYSBsaXN0IG9mIHNlbGVjdGFibGUgb3B0aW9ucywgZWl0aGVyIGluIHJhZGlvIGJ1dHRvbiBvciBjaGVja2JveCBmb3JtLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL3RvZ2dsZS1ncm91cCBEb2NzfVxuICovXG5leHBvcnQgY29uc3QgVG9nZ2xlR3JvdXAgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdUb2dnbGVHcm91cCcpO1xuLyoqXG4gKiBUaGUgYFN0YXRpc3RpY3NJdGVtYCBjb21wb25lbnQgcmVuZGVycyBhIHNpbmdsZSBkYXRhIHBvaW50IHdpdGhpbiBhIGBTdGF0aXN0aWNzYCBjb21wb25lbnQuIFVzZSB0aGlzIGNvbXBvbmVudCB0byBkaXNwbGF5IGEgc2luZ2xlIGRhdGEgcG9pbnQsIHN1Y2ggYXMgYSBudW1iZXIgb3IgcGVyY2VudGFnZS5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9zdGF0aXN0aWNzIERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBTdGF0aXN0aWNzSXRlbSA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1N0YXRpc3RpY3NJdGVtJyk7XG4vKipcbiAqIFRoZSBgU3RhdGlzdGljc2AgY29tcG9uZW50IHJlbmRlcnMgYSB2aXN1YWwgc3BvdGxpZ2h0IG9mIG9uZSBvciBtb3JlIGRhdGEgcG9pbnRzLiBJbmNsdWRlcyB0aGUgYFN0YXRpc3RpY3NJdGVtYCBhbmQgYFN0YXRpc3RpY3NUcmVuZGAgc3ViY29tcG9uZW50cy5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9zdGF0aXN0aWNzIERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBTdGF0aXN0aWNzID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnU3RhdGlzdGljcycpO1xuLyoqXG4gKiBUaGUgYFN0YXRpc3RpY3NUcmVuZGAgY29tcG9uZW50IHJlbmRlcnMgYSBwZXJjZW50YWdlIHRyZW5kIHZhbHVlIGFuZCBkaXJlY3Rpb24gYWxvbnNpZGUgYSBgU3RhdGlzdGljc0l0ZW1gIGNvbXBvbmVudC4gVXNlIHRoaXMgY29tcG9uZW50IHdpdGhpbiB0aGUgYFN0YXRpc3RpY3NJdGVtYCBjb21wb25lbnQuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvc3RhdGlzdGljcyBEb2NzfVxuICovXG5leHBvcnQgY29uc3QgU3RhdGlzdGljc1RyZW5kID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnU3RhdGlzdGljc1RyZW5kJyk7XG4vKipcbiAqIFRoZSBgVGFibGVgIGNvbXBvbmVudCByZW5kZXJzIGEgdGFibGUuIFRvIGZvcm1hdCB0aGUgdGFibGUsIHVzZSB0aGUgc3ViY29tcG9uZW50cyBgVGFibGVIZWFkYCwgYFRhYmxlUm93YCwgYFRhYmxlSGVhZGVyYCwgYFRhYmxlQm9keWAsIGBUYWJsZUNlbGxgYW5kIGBUYWJsZUZvb3RlcmAuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvdGFibGUgRG9jc31cbiAqIC0ge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9IdWJTcG90L3VpLWV4dGVuc2lvbnMtZXhhbXBsZXMvdHJlZS9tYWluL2Rlc2lnbi1wYXR0ZXJucyN0YWJsZSBEZXNpZ24gUGF0dGVybiBFeGFtcGxlfVxuICovXG5leHBvcnQgY29uc3QgVGFibGUgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdUYWJsZScpO1xuLyoqXG4gKiBUaGUgYFRhYmxlRm9vdGVyYCBjb21wb25lbnQgcmVuZGVycyBhIGZvb3RlciB3aXRoaW4gYSBgVGFibGVgIGNvbXBvbmVudC4gVXNlIHRoaXMgY29tcG9uZW50IHRvIGRpc3BsYXkgdG90YWxzIG9yIG90aGVyIHN1bW1hcnkgaW5mb3JtYXRpb24uXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvdGFibGUgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IFRhYmxlRm9vdGVyID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnVGFibGVGb290ZXInKTtcbi8qKlxuICogVGhlIGBUYWJsZUNlbGxgIGNvbXBvbmVudCByZW5kZXJzIGluZGl2aWR1YWwgY2VsbHMgd2l0aGluIHRoZSBgVGFibGVCb2R5YCBjb21wb25lbnQuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvdGFibGUgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IFRhYmxlQ2VsbCA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1RhYmxlQ2VsbCcpO1xuLyoqXG4gKiBUaGUgYFRhYmxlUm93YCBjb21wb25lbnQgcmVuZGVycyBhIHJvdyB3aXRoaW4gdGhlIGBUYWJsZUJvZHlgIG9yIGBUYWJsZUhlYWRgIGNvbXBvbmVudC5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy90YWJsZSBEb2NzfVxuICovXG5leHBvcnQgY29uc3QgVGFibGVSb3cgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdUYWJsZVJvdycpO1xuLyoqXG4gKiBUaGUgYFRhYmxlQm9keWAgY29tcG9uZW50IHJlbmRlcnMgdGhlIGJvZHkgKHJvd3MgYW5kIGNlbGxzKSBvZiBhIHRhYmxlIHdpdGhpbiB0aGUgYFRhYmxlYCBjb21wb25lbnQuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvdGFibGUgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IFRhYmxlQm9keSA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1RhYmxlQm9keScpO1xuLyoqXG4gKiBUaGUgYFRhYmxlSGVhZGVyYCBjb21wb25lbnQgcmVuZGVycyBpbmRpdmlkdWFsIGNlbGxzIGNvbnRhaW5pbmcgYm9sZGVkIGNvbHVtbiBsYWJlbHMsIHdpdGhpbiBgVGFibGVIZWFkYC5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy90YWJsZSBEb2NzfVxuICovXG5leHBvcnQgY29uc3QgVGFibGVIZWFkZXIgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdUYWJsZUhlYWRlcicpO1xuLyoqXG4gKiBUaGUgYFRhYmxlSGVhZGAgY29tcG9uZW50IHJlbmRlcnMgdGhlIGhlYWRlciBzZWN0aW9uIG9mIHRoZSBgVGFibGVgIGNvbXBvbmVudCwgY29udGFpbmluZyBjb2x1bW4gbGFiZWxzLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL3RhYmxlIERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBUYWJsZUhlYWQgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdUYWJsZUhlYWQnKTtcbi8qKlxuICogVGhlIGBOdW1iZXJJbnB1dGAgY29tcG9uZW50IHJlbmRlcnMgYSBudW1iZXIgaW5wdXQgZmllbGQuIExpa2Ugb3RoZXIgaW5wdXRzLCB0aGlzIGNvbXBvbmVudCBzaG91bGQgYmUgdXNlZCB3aXRoaW4gYSBgRm9ybWAgdGhhdCBoYXMgYSBzdWJtaXQgYnV0dG9uLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL251bWJlci1pbnB1dCBEb2NzfVxuICovXG5leHBvcnQgY29uc3QgTnVtYmVySW5wdXQgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdOdW1iZXJJbnB1dCcpO1xuLyoqXG4gKiBUaGUgYEJveGAgY29tcG9uZW50IHJlbmRlcnMgYW4gZW1wdHkgZGl2IGNvbnRhaW5lciBmb3IgZmluZSB0dW5pbmcgdGhlIHNwYWNpbmcgb2YgY29tcG9uZW50cy4gQ29tbW9ubHkgdXNlZCB3aXRoIHRoZSBgRmxleGAgY29tcG9uZW50LlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL2JveCBEb2NzfVxuICogLSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL0h1YlNwb3QvdWktZXh0ZW5zaW9ucy1leGFtcGxlcy90cmVlL21haW4vZmxleC1hbmQtYm94IEZsZXggYW5kIEJveCBFeGFtcGxlfVxuICovXG5leHBvcnQgY29uc3QgQm94ID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnQm94Jyk7XG4vKipcbiAqIFRoZSBgU3RlcEluZGljYXRvcmAgY29tcG9uZW50IHJlbmRlcnMgYW4gaW5kaWNhdG9yIHRvIHNob3cgdGhlIGN1cnJlbnQgc3RlcCBvZiBhIG11bHRpLXN0ZXAgcHJvY2Vzcy5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9zdGVwLWluZGljYXRvciBEb2NzfVxuICovXG5leHBvcnQgY29uc3QgU3RlcEluZGljYXRvciA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1N0ZXBJbmRpY2F0b3InKTtcbi8qKlxuICogVGhlIGBBY2NvcmRpb25gIGNvbXBvbmVudCByZW5kZXJzIGFuIGV4cGFuZGFibGUgYW5kIGNvbGxhcHNhYmxlIHNlY3Rpb24gdGhhdCBjYW4gY29udGFpbiBvdGhlciBjb21wb25lbnRzLiBUaGlzIGNvbXBvbmVudCBjYW4gYmUgaGVscGZ1bCBmb3Igc2F2aW5nIHNwYWNlIGFuZCBicmVha2luZyB1cCBleHRlbnNpb24gY29udGVudC5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9hY2NvcmRpb24gRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IEFjY29yZGlvbiA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0FjY29yZGlvbicpO1xuLyoqXG4gKiBUaGUgTXVsdGlTZWxlY3QgY29tcG9uZW50IHJlbmRlcnMgYSBkcm9wZG93biBtZW51IHNlbGVjdCBmaWVsZCB3aGVyZSBhIHVzZXIgY2FuIHNlbGVjdCBtdWx0aXBsZSB2YWx1ZXMuIENvbW1vbmx5IHVzZWQgd2l0aGluIHRoZSBgRm9ybWAgY29tcG9uZW50LlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL211bHRpLXNlbGVjdCBEb2NzfVxuICovXG5leHBvcnQgY29uc3QgTXVsdGlTZWxlY3QgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdNdWx0aVNlbGVjdCcpO1xuLyoqXG4gKiBUaGUgYEZsZXhgIGNvbXBvbmVudCByZW5kZXJzIGEgZmxleCBjb250YWluZXIgdGhhdCBjYW4gY29udGFpbiBvdGhlciBjb21wb25lbnRzLCBhbmQgYXJyYW5nZSB0aGVtIHdpdGggcHJvcHMuIFVzZSB0aGlzIGNvbXBvbmVudCB0byBjcmVhdGUgYSBmbGV4aWJsZSBhbmQgcmVzcG9uc2l2ZSBsYXlvdXQuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvZmxleCBEb2NzfVxuICogLSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL0h1YlNwb3QvdWktZXh0ZW5zaW9ucy1leGFtcGxlcy90cmVlL21haW4vZmxleC1hbmQtYm94IEZsZXggYW5kIEJveCBFeGFtcGxlfVxuICovXG5leHBvcnQgY29uc3QgRmxleCA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0ZsZXgnKTtcbi8qKlxuICogVGhlIGBEYXRlSW5wdXRgIGNvbXBvbmVudCByZW5kZXJzIGFuIGlucHV0IGZpZWxkIHdoZXJlIGEgdXNlciBjYW4gc2VsZWN0IGEgZGF0ZS4gQ29tbW9ubHkgdXNlZCB3aXRoaW4gdGhlIGBGb3JtYCBjb21wb25lbnQuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvZGF0ZS1pbnB1dCBEb2NzfVxuICovXG5leHBvcnQgY29uc3QgRGF0ZUlucHV0ID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnRGF0ZUlucHV0Jyk7XG4vKipcbiAqIFRoZSBgQ2hlY2tib3hgIGNvbXBvbmVudCByZW5kZXJzIGEgc2luZ2xlIGNoZWNrYm94IGlucHV0LiBDb21tb25seSB1c2VkIHdpdGhpbiB0aGUgYEZvcm1gIGNvbXBvbmVudC4gSWYgeW91IHdhbnQgdG8gZGlzcGxheSBtdWx0aXBsZSBjaGVja2JveGVzLCB5b3Ugc2hvdWxkIHVzZSBgVG9nZ2xlR3JvdXBgIGluc3RlYWQsIGFzIGl0IGNvbWVzIHdpdGggZXh0cmEgbG9naWMgZm9yIGhhbmRsaW5nIG11bHRpcGxlIGNoZWNrYm94ZXMuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvY2hlY2tib3ggRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IENoZWNrYm94ID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnQ2hlY2tib3gnKTtcbi8qKlxuICogVGhlIGBSYWRpb0J1dHRvbmAgY29tcG9uZW50IHJlbmRlcnMgYSBzaW5nbGUgcmFkaW8gaW5wdXQuIENvbW1vbmx5IHVzZWQgd2l0aGluIHRoZSBgRm9ybWAgY29tcG9uZW50LiBJZiB5b3Ugd2FudCB0byBkaXNwbGF5IG11bHRpcGxlIHJhZGlvIGlucHV0cywgeW91IHNob3VsZCB1c2UgYFRvZ2dsZUdyb3VwYCBpbnN0ZWFkLCBhcyBpdCBjb21lcyB3aXRoIGV4dHJhIGxvZ2ljIGZvciBoYW5kbGluZyBtdWx0aXBsZSBpbnB1dHMuXG4gKi9cbmV4cG9ydCBjb25zdCBSYWRpb0J1dHRvbiA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1JhZGlvQnV0dG9uJyk7XG4vKipcbiAqIFRoZSBgTGlzdGAgY29tcG9uZW50IHJlbmRlcnMgYSBsaXN0IG9mIGl0ZW1zLiBVc2UgdGhpcyBjb21wb25lbnQgdG8gZGlzcGxheSBhIGxpc3Qgb2YgaXRlbXMsIHN1Y2ggYXMgYSBsaXN0IG9mIGNvbnRhY3RzLCB0YXNrcywgb3Igb3RoZXIgZGF0YS4gQSBsaXN0IGNhbiBiZSBzdHlsZWQgYXMgYSBidWxsZXRlZCBsaXN0IG9yIGEgbnVtYmVyZWQgbGlzdC5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9saXN0IERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBMaXN0ID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnTGlzdCcpO1xuLyoqXG4gKiBUaGUgYFRvZ2dsZWAgY29tcG9uZW50IHJlbmRlcnMgYSBib29sZWFuIHRvZ2dsZSBzd2l0Y2ggdGhhdCBjYW4gYmUgY29uZmlndXJlZCB3aXRoIHNpemluZywgbGFiZWwgcG9zaXRpb24sIHJlYWQtb25seSwgYW5kIG1vcmUuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvdG9nZ2xlIERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBUb2dnbGUgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdUb2dnbGUnKTtcbi8qKlxuICogVGhlIGBEcm9wZG93bmAgY29tcG9uZW50IHJlbmRlcnMgYSBkcm9wZG93biBtZW51IHRoYXQgY2FuIGFwcGVhciBhcyBhIGJ1dHRvbiBvciBoeXBlcmxpbmsuIFVzZSB0aGlzIGNvbXBvbmVudCB0byBlbmFibGUgdXNlcnMgdG8gc2VsZWN0IGZyb20gbXVsdGlwbGUgb3B0aW9ucyBpbiBhIGNvbXBhY3QgbGlzdC5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9kcm9wZG93biBEb2NzfVxuICovXG5leHBvcnQgY29uc3QgRHJvcGRvd24gPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZUNvbXBvdW5kUmVhY3RDb21wb25lbnQoJ0Ryb3Bkb3duJywge1xuICAgIGNvbXBvdW5kQ29tcG9uZW50UHJvcGVydGllczoge1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGBEcm9wZG93bi5CdXR0b25JdGVtYCBjb21wb25lbnQgcmVwcmVzZW50cyBhIHNpbmdsZSBvcHRpb24gd2l0aGluIGEgYERyb3Bkb3duYCBtZW51LiBVc2UgdGhpcyBjb21wb25lbnQgYXMgYSBjaGlsZCBvZiB0aGUgYERyb3Bkb3duYCBjb21wb25lbnQuXG4gICAgICAgICAqXG4gICAgICAgICAqICoqTGlua3M6KipcbiAgICAgICAgICpcbiAgICAgICAgICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9kcm9wZG93biBEb2NzfVxuICAgICAgICAgKi9cbiAgICAgICAgQnV0dG9uSXRlbTogY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnRHJvcGRvd25CdXR0b25JdGVtJywge1xuICAgICAgICAgICAgZnJhZ21lbnRQcm9wczogWydvdmVybGF5J10sXG4gICAgICAgIH0pLFxuICAgIH0sXG59KTtcbi8qKlxuICogVGhlIFBhbmVsIGNvbXBvbmVudCByZW5kZXJzIGEgcGFuZWwgb3ZlcmxheSBvbiB0aGUgcmlnaHQgc2lkZSBvZiB0aGUgcGFnZSBhbmQgY29udGFpbnMgb3RoZXIgY29tcG9uZW50cy5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9wYW5lbCBEb2NzfVxuICogLSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL0h1YlNwb3QvdWktZXh0ZW5zaW9ucy1leGFtcGxlcy90cmVlL21haW4vb3ZlcmxheS1leGFtcGxlIE92ZXJsYXkgRXhhbXBsZX1cbiAqIC0ge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9IdWJTcG90L3VpLWV4dGVuc2lvbnMtZXhhbXBsZXMvdHJlZS9tYWluL2Rlc2lnbi1wYXR0ZXJucyNwYW5lbCBEZXNpZ24gUGF0dGVybiBFeGFtcGxlc31cbiAqL1xuZXhwb3J0IGNvbnN0IFBhbmVsID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnUGFuZWwnKTtcbi8qKlxuICogVGhlIGBQYW5lbEZvb3RlcmAgaXMgYSBzdGlja3kgZm9vdGVyIGNvbXBvbmVudCBkaXNwbGF5ZWQgYXQgdGhlIGJvdHRvbSBvZiBhIGBQYW5lbGAgY29tcG9uZW50LiBVc2UgdGhpcyBjb21wb25lbnQgdG8gZGlzcGxheSBhY3Rpb25zIG9yIG90aGVyIGNvbnRlbnQgdGhhdCBzaG91bGQgYmUgdmlzaWJsZSBhdCBhbGwgdGltZXMuIEluY2x1ZGUgb25seSBvbmUgYFBhbmVsRm9vdGVyYCBjb21wb25lbnQgcGVyIGBQYW5lbGAuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvcGFuZWwtZm9vdGVyIERvY3N9XG4gKiAtIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vSHViU3BvdC91aS1leHRlbnNpb25zLWV4YW1wbGVzL3RyZWUvbWFpbi9vdmVybGF5LWV4YW1wbGUgT3ZlcmxheSBFeGFtcGxlfVxuICovXG5leHBvcnQgY29uc3QgUGFuZWxGb290ZXIgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdQYW5lbEZvb3RlcicpO1xuLyoqXG4gKiBUaGUgYFBhbmVsQm9keWAgY29tcG9uZW50IGlzIGEgY29udGFpbmVyIHRoYXQgd3JhcHMgdGhlIHBhbmVsJ3MgY29udGVudCBhbmQgbWFrZXMgaXQgc2Nyb2xsYWJsZS4gSW5jbHVkZSBvbmx5IG9uZSBgUGFuZWxCb2R5YCBjb21wb25lbnQgcGVyIGBQYW5lbGAuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvcGFuZWwtZm9vdGVyIERvY3N9XG4gKiAtIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vSHViU3BvdC91aS1leHRlbnNpb25zLWV4YW1wbGVzL3RyZWUvbWFpbi9vdmVybGF5LWV4YW1wbGUgT3ZlcmxheSBFeGFtcGxlfVxuICovXG5leHBvcnQgY29uc3QgUGFuZWxCb2R5ID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnUGFuZWxCb2R5Jyk7XG4vKipcbiAqIFRoZSBgUGFuZWxTZWN0aW9uYCBjb21wb25lbnQgaXMgYSBjb250YWluZXIgdGhhdCBhZGRzIHBhZGRpbmcgYW5kIGJvdHRvbSBtYXJnaW4gdG8gcHJvdmlkZSBzcGFjaW5nIGJldHdlZW4gY29udGVudC4gVXNlIHRoZSBgUGFuZWxTZWN0aW9uYCBjb21wb25lbnQgdG8gc2VwYXJhdGUgY29udGVudCB3aXRoaW4gYSBgUGFuZWxCb2R5YC5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9wYW5lbC1mb290ZXIgRG9jc31cbiAqIC0ge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9IdWJTcG90L3VpLWV4dGVuc2lvbnMtZXhhbXBsZXMvdHJlZS9tYWluL292ZXJsYXktZXhhbXBsZSBPdmVybGF5IEV4YW1wbGV9XG4gKi9cbmV4cG9ydCBjb25zdCBQYW5lbFNlY3Rpb24gPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdQYW5lbFNlY3Rpb24nKTtcbi8qKlxuICogVGhlIGBTdGVwcGVySW5wdXRgIGNvbXBvbmVudCByZW5kZXJzIGEgbnVtYmVyIGlucHV0IGZpZWxkIHRoYXQgY2FuIGJlIGluY3JlYXNlZCBvciBkZWNyZWFzZWQgYnkgYSBzZXQgbnVtYmVyLiBDb21tb25seSB1c2VkIHdpdGhpbiB0aGUgYEZvcm1gIGNvbXBvbmVudC5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9zdGVwcGVyLWlucHV0IERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBTdGVwcGVySW5wdXQgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdTdGVwcGVySW5wdXQnKTtcbi8qKlxuICogVGhlIE1vZGFsIGNvbXBvbmVudCByZW5kZXJzIGEgcG9wLXVwIG92ZXJsYXkgdGhhdCBjYW4gY29udGFpbiBvdGhlciBjb21wb25lbnRzLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL21vZGFsIERvY3N9XG4gKiAtIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vSHViU3BvdC91aS1leHRlbnNpb25zLWV4YW1wbGVzL3RyZWUvbWFpbi9vdmVybGF5LWV4YW1wbGUgT3ZlcmxheSBFeGFtcGxlfVxuICogLSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL0h1YlNwb3QvdWktZXh0ZW5zaW9ucy1leGFtcGxlcy90cmVlL21haW4vZGVzaWduLXBhdHRlcm5zI21vZGFsIERlc2lnbiBQYXR0ZXJuIEV4YW1wbGVzfVxuICovXG5leHBvcnQgY29uc3QgTW9kYWwgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdNb2RhbCcpO1xuLyoqXG4gKiBUaGUgYE1vZGFsQm9keWAgY29tcG9uZW50IGNvbnRhaW5zIHRoZSBtYWluIGNvbnRlbnQgb2YgdGhlIG1vZGFsLiBPbmUgYE1vZGFsQm9keWAgaXMgcmVxdWlyZWQgcGVyIGBNb2RhbGAuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvbW9kYWwgRG9jc31cbiAqIC0ge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9IdWJTcG90L3VpLWV4dGVuc2lvbnMtZXhhbXBsZXMvdHJlZS9tYWluL292ZXJsYXktZXhhbXBsZSBPdmVybGF5IEV4YW1wbGV9XG4gKi9cbmV4cG9ydCBjb25zdCBNb2RhbEJvZHkgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdNb2RhbEJvZHknKTtcbi8qKlxuICogVGhlIGBNb2RhbEZvb3RlcmAgY29tcG9uZW50IGlzIGFuIG9wdGlvbmFsIGNvbXBvbmVudCB0byBmb3JtYXQgdGhlIGZvb3RlciBzZWN0aW9uIG9mIHRoZSBtb2RhbC4gVXNlIG9uZSBgTW9kYWxGb290ZXJgIHBlciBgTW9kYWxgLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL21vZGFsIERvY3N9XG4gKiAtIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vSHViU3BvdC91aS1leHRlbnNpb25zLWV4YW1wbGVzL3RyZWUvbWFpbi9vdmVybGF5LWV4YW1wbGUgT3ZlcmxheSBFeGFtcGxlfVxuICovXG5leHBvcnQgY29uc3QgTW9kYWxGb290ZXIgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdNb2RhbEZvb3RlcicpO1xuLyoqXG4gKiBVc2UgdGhlIGBJY29uYCBjb21wb25lbnQgdG8gcmVuZGVyIGEgdmlzdWFsIGljb24gd2l0aGluIG90aGVyIGNvbXBvbmVudHMuIEl0IGNhbiBnZW5lcmFsbHkgYmUgdXNlZCBpbnNpZGUgbW9zdCBjb21wb25lbnRzLCBleGNsdWRpbmcgb25lcyB0aGF0IGRvbid0IHN1cHBvcnQgY2hpbGQgY29tcG9uZW50cy5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9pY29uIERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBJY29uID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnSWNvbicpO1xuLyoqXG4gKiBUaGUgYFN0YXR1c1RhZ2AgY29tcG9uZW50IHJlbmRlcnMgYSB2aXN1YWwgaW5kaWNhdG9yIHRvIGRpc3BsYXkgdGhlIGN1cnJlbnQgc3RhdHVzIG9mIGFuIGl0ZW0uIFN0YXR1cyB0YWdzIGNhbiBiZSBzdGF0aWMgb3IgY2xpY2thYmxlLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL3N0YXR1cy10YWcgRG9jc31cbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvc3RhdHVzLXRhZyN2YXJpYW50cyBWYXJpYW50c31cbiAqL1xuZXhwb3J0IGNvbnN0IFN0YXR1c1RhZyA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1N0YXR1c1RhZycpO1xuLyoqXG4gKiBUaGUgYExvYWRpbmdCdXR0b25gIGNvbXBvbmVudCByZW5kZXJzIGEgYnV0dG9uIHdpdGggbG9hZGluZyBzdGF0ZSBvcHRpb25zLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL2xvYWRpbmctYnV0dG9uIERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBMb2FkaW5nQnV0dG9uID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnTG9hZGluZ0J1dHRvbicsIHtcbiAgICBmcmFnbWVudFByb3BzOiBbJ292ZXJsYXknXSxcbn0pO1xuLyoqXG4gKiBUaGUgYEJhckNoYXJ0YCBjb21wb25lbnQgcmVuZGVycyBhIGJhciBjaGFydCBmb3IgdmlzdWFsaXppbmcgZGF0YS4gVGhpcyB0eXBlIG9mIGNoYXJ0IGlzIGJlc3Qgc3VpdGVkIGZvciBjb21wYXJpbmcgY2F0ZWdvcmljYWwgZGF0YS5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9iYXItY2hhcnQgQmFyQ2hhcnQgRG9jc31cbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvY2hhcnRzIENoYXJ0cyBEb2NzfVxuICogLSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL0h1YlNwb3QvdWktZXh0ZW5zaW9ucy1leGFtcGxlcy90cmVlL21haW4vY2hhcnRzLWV4YW1wbGUgQ2hhcnRzIEV4YW1wbGV9XG4gKi9cbmV4cG9ydCBjb25zdCBCYXJDaGFydCA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0JhckNoYXJ0Jyk7XG4vKipcbiAqIFRoZSBgTGluZUNoYXJ0YCBjb21wb25lbnQgcmVuZGVycyBhIGxpbmUgY2hhcnQgZm9yIHZpc3VhbGl6aW5nIGRhdGEuIFRoaXMgdHlwZSBvZiBjaGFydCBpcyBiZXN0IHN1aXRlZCBmb3IgdGltZSBzZXJpZXMgcGxvdHMgb3IgdHJlbmQgZGF0YS5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9saW5lLWNoYXJ0IExpbmVDaGFydCBEb2NzfVxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9jaGFydHMgQ2hhcnRzIERvY3N9XG4gKiAtIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vSHViU3BvdC91aS1leHRlbnNpb25zLWV4YW1wbGVzL3RyZWUvbWFpbi9jaGFydHMtZXhhbXBsZSBDaGFydHMgRXhhbXBsZX1cbiAqL1xuZXhwb3J0IGNvbnN0IExpbmVDaGFydCA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0xpbmVDaGFydCcpO1xuLyoqXG4gKiBgVGFic2AgYWxsb3cgeW91IHRvIGdyb3VwIHJlbGF0ZWQgY29udGVudCBpbiBhIGNvbXBhY3Qgc3BhY2UsIGFsbG93aW5nIHVzZXJzIHRvIHN3aXRjaCBiZXR3ZWVuIHZpZXdzIHdpdGhvdXQgbGVhdmluZyB0aGUgcGFnZS5cbiAqIEBleGFtcGxlXG4gKiBgYGB0c3hcbiAqIDxUYWJzIGRlZmF1bHRTZWxlY3RlZD1cIjFcIj5cbiAqICAgPFRhYiB0YWJJZD1cIjFcIj5GaXJzdCB0YWIgY29udGVudDwvVGFiPlxuICogICA8VGFiIHRhYklkPVwiMlwiPlNlY29uZCB0YWIgY29udGVudDwvVGFiPlxuICogPC9UYWJzPlxuICogYGBgXG4gKlxuICogKipMaW5rczoqKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy90YWJzIERvY3VtZW50YXRpb259XG4gKiAtIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaHVic3BvdGRldi91aWUtdGFiYmVkLXByb2R1Y3QtY2Fyb3VzZWwgVGFicyBFeGFtcGxlfVxuICovXG5leHBvcnQgY29uc3QgVGFicyA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1RhYnMnKTtcbi8qKlxuICogRWFjaCBgVGFiYCByZXByZXNlbnRzIGEgc2luZ2xlIHRhYiAob3IgXCJ2aWV3XCIpIHdpdGhpbiB0aGUgcGFyZW50IGBUYWJzYCBjb21wb25lbnQuXG4gKiBAZXhhbXBsZVxuICogYGBgdHN4XG4gKiA8VGFicyBkZWZhdWx0U2VsZWN0ZWQ9XCIxXCI+XG4gKiAgIDxUYWIgdGFiSWQ9XCIxXCI+Rmlyc3QgdGFiIGNvbnRlbnQ8L1RhYj5cbiAqICAgPFRhYiB0YWJJZD1cIjJcIj5TZWNvbmQgdGFiIGNvbnRlbnQ8L1RhYj5cbiAqIDwvVGFicz5cbiAqIGBgYFxuICpcbiAqICoqTGlua3M6KipcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvdGFicyBEb2N1bWVudGF0aW9ufVxuICogLSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2h1YnNwb3RkZXYvdWllLXRhYmJlZC1wcm9kdWN0LWNhcm91c2VsIFRhYnMgRXhhbXBsZX1cbiAqL1xuZXhwb3J0IGNvbnN0IFRhYiA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ1RhYicpO1xuLyoqXG4gKiBUaGUgYElsbHVzdHJhdGlvbmAgY29tcG9uZW50IHJlbmRlcnMgYW4gaWxsdXN0cmF0aW9uLlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL2lsbHVzdHJhdGlvbiBJbGx1c3RyYXRpb24gRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IElsbHVzdHJhdGlvbiA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0lsbHVzdHJhdGlvbicpO1xuLyoqXG4gKiBUaGUgYFRvb2x0aXBgIGNvbXBvbmVudCByZW5kZXJzIGEgdG9vbHRpcCBmb3IgYSBjb21wb25lbnQuXG4gKlxuICogKipMaW5rczoqKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy90b29sdGlwIERvY3VtZW50YXRpb259XG4gKi9cbmV4cG9ydCBjb25zdCBUb29sdGlwID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnVG9vbHRpcCcpO1xuLyoqXG4gKiBUaGUgYFNlYXJjaElucHV0YCBjb21wb25lbnQgcmVuZGVycyBhIHNlYXJjaCBpbnB1dCBmaWVsZC5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9zZWFyY2gtaW5wdXQgU2VhcmNoSW5wdXQgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IFNlYXJjaElucHV0ID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnU2VhcmNoSW5wdXQnKTtcbi8qKlxuICogVGhlIGBUaW1lSW5wdXRgIGNvbXBvbmVudCByZW5kZXJzIGFuIGlucHV0IGZpZWxkIHdoZXJlIGEgdXNlciBjYW4gc2VsZWN0IGEgdGltZS4gQ29tbW9ubHkgdXNlZCB3aXRoaW4gdGhlIGBGb3JtYCBjb21wb25lbnQuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvdGltZS1pbnB1dCBEb2NzfVxuICovXG5leHBvcnQgY29uc3QgVGltZUlucHV0ID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnVGltZUlucHV0Jyk7XG4vKipcbiAqIFRoZSBgQ3VycmVuY3lJbnB1dGAgY29tcG9uZW50IHJlbmRlcnMgYSBjdXJyZW5jeSBpbnB1dCBmaWVsZCB3aXRoIHByb3BlciBmb3JtYXR0aW5nLFxuICogY3VycmVuY3kgc3ltYm9scywgYW5kIGxvY2FsZS1zcGVjaWZpYyBkaXNwbGF5IHBhdHRlcm5zLiBDb21tb25seSB1c2VkIHdpdGhpbiB0aGUgYEZvcm1gIGNvbXBvbmVudC5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9jdXJyZW5jeS1pbnB1dCBEb2NzfVxuICovXG5leHBvcnQgY29uc3QgQ3VycmVuY3lJbnB1dCA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0N1cnJlbmN5SW5wdXQnKTtcbi8qKlxuICogVGhlIGBJbmxpbmVgIGNvbXBvbmVudCBzcHJlYWRzIGFsaWducyBpdHMgY2hpbGRyZW4gaG9yaXpvbnRhbGx5IChhbG9uZyB0aGUgeC1heGlzKS5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9pbmxpbmUgRG9jc31cbiAqLyBleHBvcnQgY29uc3QgSW5saW5lID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnSW5saW5lJyk7XG4vKipcbiAqIFRoZSBgQXV0b0dyaWRgIGNvbXBvbmVudCByZW5kZXJzIGEgcmVzcG9uc2l2ZSBncmlkIGxheW91dCB0aGF0IGF1dG9tYXRpY2FsbHkgYWRqdXN0cyB0aGUgbnVtYmVyIG9mIGNvbHVtbnMgYmFzZWQgb24gYXZhaWxhYmxlIHNwYWNlLiBVc2UgdGhpcyBjb21wb25lbnQgdG8gY3JlYXRlIGZsZXhpYmxlIGdyaWQgbGF5b3V0cyBmb3IgY2FyZHMsIHRpbGVzLCBvciBvdGhlciBjb250ZW50LlxuICpcbiAqICoqTGlua3M6KipcbiAqXG4gKiAtIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuaHVic3BvdC5jb20vZG9jcy9yZWZlcmVuY2UvdWktY29tcG9uZW50cy9zdGFuZGFyZC1jb21wb25lbnRzL3NpbXBsZS1ncmlkIERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBBdXRvR3JpZCA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0F1dG9HcmlkJyk7XG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gQ1JNIENPTVBPTkVOVFNcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5leHBvcnQgY29uc3QgQ3JtUHJvcGVydHlMaXN0ID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnQ3JtUHJvcGVydHlMaXN0Jyk7XG5leHBvcnQgY29uc3QgQ3JtQXNzb2NpYXRpb25UYWJsZSA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0NybUFzc29jaWF0aW9uVGFibGUnKTtcbmV4cG9ydCBjb25zdCBDcm1EYXRhSGlnaGxpZ2h0ID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnQ3JtRGF0YUhpZ2hsaWdodCcpO1xuZXhwb3J0IGNvbnN0IENybVJlcG9ydCA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0NybVJlcG9ydCcpO1xuZXhwb3J0IGNvbnN0IENybUFzc29jaWF0aW9uUGl2b3QgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdDcm1Bc3NvY2lhdGlvblBpdm90Jyk7XG5leHBvcnQgY29uc3QgQ3JtQXNzb2NpYXRpb25Qcm9wZXJ0eUxpc3QgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdDcm1Bc3NvY2lhdGlvblByb3BlcnR5TGlzdCcpO1xuZXhwb3J0IGNvbnN0IENybUFzc29jaWF0aW9uU3RhZ2VUcmFja2VyID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnQ3JtQXNzb2NpYXRpb25TdGFnZVRyYWNrZXInKTtcbmV4cG9ydCBjb25zdCBDcm1TaW1wbGVEZWFkbGluZSA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0NybVNpbXBsZURlYWRsaW5lJyk7XG5leHBvcnQgY29uc3QgQ3JtU3RhZ2VUcmFja2VyID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnQ3JtU3RhZ2VUcmFja2VyJyk7XG5leHBvcnQgY29uc3QgQ3JtU3RhdGlzdGljcyA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0NybVN0YXRpc3RpY3MnKTtcbmV4cG9ydCBjb25zdCBDcm1BY3Rpb25CdXR0b24gPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdDcm1BY3Rpb25CdXR0b24nKTtcbmV4cG9ydCBjb25zdCBDcm1BY3Rpb25MaW5rID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnQ3JtQWN0aW9uTGluaycpO1xuZXhwb3J0IGNvbnN0IENybUNhcmRBY3Rpb25zID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnQ3JtQ2FyZEFjdGlvbnMnKTtcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBBUFAgSE9NRSBDT01QT05FTlRTXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLyoqXG4gKiBUaGUgYEhlYWRlckFjdGlvbnNgIGNvbXBvbmVudCByZW5kZXJzIGEgY29udGFpbmVyIGZvciBhY3Rpb24gYnV0dG9ucyBpbiB0aGUgYXBwIGhvbWUgaGVhZGVyLiBJdCBhY2NlcHRzIGBQcmltYXJ5SGVhZGVyQWN0aW9uQnV0dG9uYCBhbmQgYFNlY29uZGFyeUhlYWRlckFjdGlvbkJ1dHRvbmAgYXMgY2hpbGRyZW4uXG4gKlxuICovXG5leHBvcnQgY29uc3QgSGVhZGVyQWN0aW9ucyA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0hlYWRlckFjdGlvbnMnKTtcbi8qKlxuICogVGhlIGBQcmltYXJ5SGVhZGVyQWN0aW9uQnV0dG9uYCBjb21wb25lbnQgcmVuZGVycyBhIHByaW1hcnkgYWN0aW9uIGJ1dHRvbiBpbiB0aGUgYXBwIGhvbWUgaGVhZGVyLiBUaGlzIGJ1dHRvbiBpcyBzdHlsZWQgYXMgdGhlIG1haW4gY2FsbC10by1hY3Rpb24gYW5kIG9ubHkgb25lIHNob3VsZCBiZSB1c2VkIHBlciBgSGVhZGVyQWN0aW9uc2AgY29udGFpbmVyLlxuICpcbiAqL1xuZXhwb3J0IGNvbnN0IFByaW1hcnlIZWFkZXJBY3Rpb25CdXR0b24gPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdQcmltYXJ5SGVhZGVyQWN0aW9uQnV0dG9uJywge1xuICAgIGZyYWdtZW50UHJvcHM6IFsnb3ZlcmxheSddLFxufSk7XG4vKipcbiAqIFRoZSBgU2Vjb25kYXJ5SGVhZGVyQWN0aW9uQnV0dG9uYCBjb21wb25lbnQgcmVuZGVycyBhIHNlY29uZGFyeSBhY3Rpb24gYnV0dG9uIGluIHRoZSBhcHAgaG9tZSBoZWFkZXIuIE11bHRpcGxlIHNlY29uZGFyeSBhY3Rpb25zIGNhbiBiZSB1c2VkIGFuZCB0aGV5IHdpbGwgYmUgZ3JvdXBlZCBhcHByb3ByaWF0ZWx5IGluIHRoZSBoZWFkZXIuXG4gKlxuICovXG5leHBvcnQgY29uc3QgU2Vjb25kYXJ5SGVhZGVyQWN0aW9uQnV0dG9uID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnU2Vjb25kYXJ5SGVhZGVyQWN0aW9uQnV0dG9uJywge1xuICAgIGZyYWdtZW50UHJvcHM6IFsnb3ZlcmxheSddLFxufSk7XG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gRVhQRVJJTUVOVEFMIENPTVBPTkVOVFNcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vKipcbiAqIEBleHBlcmltZW50YWwgVGhpcyBjb21wb25lbnQgaXMgZXhwZXJpbWVudGFsLiBBdm9pZCB1c2luZyBpdCBpbiBwcm9kdWN0aW9uIGR1ZSB0byBwb3RlbnRpYWwgYnJlYWtpbmcgY2hhbmdlcy4gWW91ciBmZWVkYmFjayBpcyB2YWx1YWJsZSBmb3IgaW1wcm92ZW1lbnRzLiBTdGF5IHR1bmVkIGZvciB1cGRhdGVzLlxuICovXG5leHBvcnQgY29uc3QgSWZyYW1lID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnSWZyYW1lJyk7XG4vKipcbiAqIEBleHBlcmltZW50YWwgVGhpcyBjb21wb25lbnQgaXMgZXhwZXJpbWVudGFsLiBBdm9pZCB1c2luZyBpdCBpbiBwcm9kdWN0aW9uIGR1ZSB0byBwb3RlbnRpYWwgYnJlYWtpbmcgY2hhbmdlcy4gWW91ciBmZWVkYmFjayBpcyB2YWx1YWJsZSBmb3IgaW1wcm92ZW1lbnRzLiBTdGF5IHR1bmVkIGZvciB1cGRhdGVzLlxuICovXG5leHBvcnQgY29uc3QgTWVkaWFPYmplY3QgPSBjcmVhdGVBbmRSZWdpc3RlclJlbW90ZVJlYWN0Q29tcG9uZW50KCdNZWRpYU9iamVjdCcsIHtcbiAgICBmcmFnbWVudFByb3BzOiBbJ2l0ZW1SaWdodCcsICdpdGVtTGVmdCddLFxufSk7XG4vKipcbiAqIEBleHBlcmltZW50YWwgVGhpcyBjb21wb25lbnQgaXMgZXhwZXJpbWVudGFsLiBBdm9pZCB1c2luZyBpdCBpbiBwcm9kdWN0aW9uIGR1ZSB0byBwb3RlbnRpYWwgYnJlYWtpbmcgY2hhbmdlcy4gWW91ciBmZWVkYmFjayBpcyB2YWx1YWJsZSBmb3IgaW1wcm92ZW1lbnRzLiBTdGF5IHR1bmVkIGZvciB1cGRhdGVzLlxuICovXG5leHBvcnQgY29uc3QgU3RhY2syID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnU3RhY2syJyk7XG4vKipcbiAqIEBleHBlcmltZW50YWwgVGhpcyBjb21wb25lbnQgaXMgZXhwZXJpbWVudGFsLiBBdm9pZCB1c2luZyBpdCBpbiBwcm9kdWN0aW9uIGR1ZSB0byBwb3RlbnRpYWwgYnJlYWtpbmcgY2hhbmdlcy4gWW91ciBmZWVkYmFjayBpcyB2YWx1YWJsZSBmb3IgaW1wcm92ZW1lbnRzLiBTdGF5IHR1bmVkIGZvciB1cGRhdGVzLlxuICovXG5leHBvcnQgY29uc3QgQ2VudGVyID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnQ2VudGVyJyk7XG4vKipcbiAqIEBleHBlcmltZW50YWwgVGhpcyBjb21wb25lbnQgaXMgZXhwZXJpbWVudGFsLiBBdm9pZCB1c2luZyBpdCBpbiBwcm9kdWN0aW9uIGR1ZSB0byBwb3RlbnRpYWwgYnJlYWtpbmcgY2hhbmdlcy4gWW91ciBmZWVkYmFjayBpcyB2YWx1YWJsZSBmb3IgaW1wcm92ZW1lbnRzLiBTdGF5IHR1bmVkIGZvciB1cGRhdGVzLlxuICovXG5leHBvcnQgY29uc3QgR3JpZCA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0dyaWQnKTtcbi8qKlxuICogQGV4cGVyaW1lbnRhbCBUaGlzIGNvbXBvbmVudCBpcyBleHBlcmltZW50YWwuIEF2b2lkIHVzaW5nIGl0IGluIHByb2R1Y3Rpb24gZHVlIHRvIHBvdGVudGlhbCBicmVha2luZyBjaGFuZ2VzLiBZb3VyIGZlZWRiYWNrIGlzIHZhbHVhYmxlIGZvciBpbXByb3ZlbWVudHMuIFN0YXkgdHVuZWQgZm9yIHVwZGF0ZXMuXG4gKi9cbmV4cG9ydCBjb25zdCBHcmlkSXRlbSA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0dyaWRJdGVtJyk7XG4vKipcbiAqIEBleHBlcmltZW50YWwgVGhpcyBjb21wb25lbnQgaXMgZXhwZXJpbWVudGFsLiBBdm9pZCB1c2luZyBpdCBpbiBwcm9kdWN0aW9uIGR1ZSB0byBwb3RlbnRpYWwgYnJlYWtpbmcgY2hhbmdlcy4gWW91ciBmZWVkYmFjayBpcyB2YWx1YWJsZSBmb3IgaW1wcm92ZW1lbnRzLiBTdGF5IHR1bmVkIGZvciB1cGRhdGVzLlxuICovXG5leHBvcnQgY29uc3QgU2V0dGluZ3NWaWV3ID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnU2V0dGluZ3NWaWV3Jyk7XG4vKipcbiAqIFRoZSBgRXhwYW5kYWJsZVRleHRgIGNvbXBvbmVudCByZW5kZXJzIGEgdGV4dCB0aGF0IGNhbiBiZSBleHBhbmRlZCBvciBjb2xsYXBzZWQgYmFzZWQgb24gYSBtYXhpbXVtIGhlaWdodC5cbiAqXG4gKiBAZXhwZXJpbWVudGFsIFRoaXMgY29tcG9uZW50IGlzIGV4cGVyaW1lbnRhbC4gQXZvaWQgdXNpbmcgaXQgaW4gcHJvZHVjdGlvbiBkdWUgdG8gcG90ZW50aWFsIGJyZWFraW5nIGNoYW5nZXMuIFlvdXIgZmVlZGJhY2sgaXMgdmFsdWFibGUgZm9yIGltcHJvdmVtZW50cy4gU3RheSB0dW5lZCBmb3IgdXBkYXRlcy5cbiAqXG4gKiAqKkxpbmtzOioqXG4gKlxuICogLSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmh1YnNwb3QuY29tL2RvY3MvcmVmZXJlbmNlL3VpLWNvbXBvbmVudHMvc3RhbmRhcmQtY29tcG9uZW50cy9leHBhbmRhYmxlLXRleHQgRXhwYW5kYWJsZVRleHQgRG9jc31cbiAqL1xuZXhwb3J0IGNvbnN0IEV4cGFuZGFibGVUZXh0ID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnRXhwYW5kYWJsZVRleHQnKTtcbi8qKlxuICogVGhlIGBQb3BvdmVyYCBjb21wb25lbnQgcmVuZGVycyBhIHBvcG92ZXIgb3ZlcmxheSB0aGF0IGNhbiBjb250YWluIG90aGVyIGNvbXBvbmVudHMuXG4gKlxuICogQGV4cGVyaW1lbnRhbCBUaGlzIGNvbXBvbmVudCBpcyBleHBlcmltZW50YWwuIEF2b2lkIHVzaW5nIGl0IGluIHByb2R1Y3Rpb24gZHVlIHRvIHBvdGVudGlhbCBicmVha2luZyBjaGFuZ2VzLiBZb3VyIGZlZWRiYWNrIGlzIHZhbHVhYmxlIGZvciBpbXByb3ZlbWVudHMuIFN0YXkgdHVuZWQgZm9yIHVwZGF0ZXMuXG4gKlxuICogKipMaW5rczoqKlxuICpcbiAqIC0ge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5odWJzcG90LmNvbS9kb2NzL3JlZmVyZW5jZS91aS1jb21wb25lbnRzL3N0YW5kYXJkLWNvbXBvbmVudHMvcG9wb3ZlciBQb3BvdmVyIERvY3N9XG4gKi9cbmV4cG9ydCBjb25zdCBQb3BvdmVyID0gY3JlYXRlQW5kUmVnaXN0ZXJSZW1vdGVSZWFjdENvbXBvbmVudCgnUG9wb3ZlcicpO1xuLyoqXG4gKiBAZXhwZXJpbWVudGFsIFRoaXMgY29tcG9uZW50IGlzIGV4cGVyaW1lbnRhbC4gQXZvaWQgdXNpbmcgaXQgaW4gcHJvZHVjdGlvbiBkdWUgdG8gcG90ZW50aWFsIGJyZWFraW5nIGNoYW5nZXMuIFlvdXIgZmVlZGJhY2sgaXMgdmFsdWFibGUgZm9yIGltcHJvdmVtZW50cy4gU3RheSB0dW5lZCBmb3IgdXBkYXRlcy5cbiAqL1xuZXhwb3J0IGNvbnN0IEZpbGVJbnB1dCA9IGNyZWF0ZUFuZFJlZ2lzdGVyUmVtb3RlUmVhY3RDb21wb25lbnQoJ0ZpbGVJbnB1dCcpO1xuIiwiaW1wb3J0IHsgY3JlYXRlQ29udGV4dCwgdXNlQ29udGV4dCB9IGZyb20gJ3JlYWN0JztcbmNvbnN0IE1vY2tzQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQobnVsbCk7XG4vKipcbiAqIENyZWF0ZXMgYSBtb2NrLWF3YXJlIGhvb2sgZnVuY3Rpb24gdGhhdCBjYW4gYmUgdXNlZCB0byBtb2NrIHRoZSBvcmlnaW5hbCBob29rIGZ1bmN0aW9uLlxuICogVGhlIG1vY2stYXdhcmUgaG9vayBmdW5jdGlvbiB3aWxsIHJldHVybiB0aGUgbW9ja2VkIGhvb2sgZnVuY3Rpb24gaWYgYSBtb2NrIGlzIGZvdW5kLCBvdGhlcndpc2UgaXQgd2lsbCByZXR1cm4gdGhlIG9yaWdpbmFsIGhvb2sgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIGhvb2tOYW1lIFRoZSBuYW1lIG9mIHRoZSBob29rIHRvIG1vY2sgdGhhdCBjb3JyZXNwb25kcyB0byB0aGUga2V5IGluIHRoZSBNb2NrcyBpbnRlcmZhY2VcbiAqIEBwYXJhbSBvcmlnaW5hbEhvb2tGdW5jdGlvbiBUaGUgb3JpZ2luYWwgaG9vayBmdW5jdGlvbiB0byBjYWxsIGlmIG5vIG1vY2sgaXMgZm91bmRcbiAqIEByZXR1cm5zIFRoZSBtb2NrZWQgaG9vayBmdW5jdGlvbiBvciB0aGUgb3JpZ2luYWwgaG9vayBmdW5jdGlvbiBpZiBubyBtb2NrIGlzIGZvdW5kXG4gKi9cbmV4cG9ydCBjb25zdCBjcmVhdGVNb2NrQXdhcmVIb29rID0gKGhvb2tOYW1lLCBvcmlnaW5hbEhvb2tGdW5jdGlvbikgPT4ge1xuICAgIGNvbnN0IHVzZVdyYXBwZXIgPSAoLi4uYXJncykgPT4ge1xuICAgICAgICBjb25zdCBtb2NrcyA9IHVzZU1vY2tzQ29udGV4dCgpO1xuICAgICAgICBpZiAoIW1vY2tzKSB7XG4gICAgICAgICAgICAvLyBJZiBubyBtb2NrcyBhcmUgcHJvdmlkZWQsIGNhbGwgdGhlIG9yaWdpbmFsIGhvb2sgZnVuY3Rpb25cbiAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbEhvb2tGdW5jdGlvbiguLi5hcmdzKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBXaGVuIGEgbW9jayBpcyBwcm92aWRlZCBieSB0aGUgdGVzdGluZyB1dGlsaXRpZXMgKHZpYSA8TW9ja3NDb250ZXh0UHJvdmlkZXI+KSwgcmV0dXJuIHRoZSBtb2NrZWQgaG9vayBmdW5jdGlvblxuICAgICAgICBjb25zdCBtb2NrSG9vayA9IG1vY2tzW2hvb2tOYW1lXTtcbiAgICAgICAgaWYgKCFtb2NrSG9vaykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbGxlZ2FsIFN0YXRlOiBNb2NrIGZvciBob29rICR7aG9va05hbWV9IG5vdCBmb3VuZC5gKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBDYWxsIHRoZSBtb2NrZWQgaG9vayBmdW5jdGlvbiB3aXRoIHRoZSBzYW1lIGFyZ3VtZW50cyBhcyB0aGUgb3JpZ2luYWwgaG9vayBmdW5jdGlvbiBhbmQgcmV0dXJuIHRoZSByZXN1bHRcbiAgICAgICAgcmV0dXJuIG1vY2tIb29rKC4uLmFyZ3MpO1xuICAgIH07XG4gICAgcmV0dXJuIHVzZVdyYXBwZXI7XG59O1xuLyoqXG4gKiBBIGhvb2sgdGhhdCBwcm92aWRlcyBhY2Nlc3MgdG8gdGhlIE1vY2tzIGNvbnRleHQuXG4gKiBSZXR1cm5zIHRoZSBtb2NrcyBvYmplY3QgaWYgaW5zaWRlIGEgTW9ja3NDb250ZXh0UHJvdmlkZXIsIG90aGVyd2lzZSByZXR1cm5zIG51bGwuXG4gKlxuICogQHJldHVybnMgVGhlIG1vY2tzIG9iamVjdCBvciBudWxsIGlmIG5vdCBpbiBhIHRlc3QgZW52aXJvbm1lbnQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1c2VNb2Nrc0NvbnRleHQoKSB7XG4gICAgcmV0dXJuIHVzZUNvbnRleHQoTW9ja3NDb250ZXh0KTtcbn1cbi8qKlxuICogQSBSZWFjdCBjb21wb25lbnQgdGhhdCBwcm92aWRlcyB0aGUgTW9ja3MgY29udGV4dCB0aGF0IGNhbiBiZSB1c2VkIHRvIHByb3ZpZGUgbW9ja3MgdG8gdGhlIG1vY2stYXdhcmUgaG9vayBmdW5jdGlvbnMuXG4gKlxuICogQHBhcmFtIGNoaWxkcmVuIFRoZSBjaGlsZHJlbiB0byByZW5kZXIuXG4gKiBAcmV0dXJucyBUaGUgY2hpbGRyZW4gd3JhcHBlZCBpbiB0aGUgTW9ja3MgY29udGV4dCBwcm92aWRlci5cbiAqL1xuZXhwb3J0IGNvbnN0IE1vY2tzQ29udGV4dFByb3ZpZGVyID0gTW9ja3NDb250ZXh0LlByb3ZpZGVyO1xuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHtcclxuICBodWJzcG90LFxyXG4gIEJ1dHRvbixcclxuICBMb2FkaW5nQnV0dG9uLFxyXG4gIFRleHQsXHJcbiAgRmxleCxcclxuICBJbWFnZSxcclxuICBJY29uLFxyXG4gIExpbmssXHJcbiAgVG9vbHRpcCxcclxuICBUaWxlLFxyXG4gIEJ1dHRvblJvdyxcclxufSBmcm9tIFwiQGh1YnNwb3QvdWktZXh0ZW5zaW9uc1wiO1xyXG5cclxudHlwZSBIdWJTcG90Q29udGV4dCA9IHtcclxuICBjcm0/OiB7IG9iamVjdElkPzogc3RyaW5nOyByZWNvcmRJZD86IHN0cmluZyB9O1xyXG4gIG9iamVjdElkPzogc3RyaW5nO1xyXG4gIHVzZXI/OiB7IGZpcnN0TmFtZT86IHN0cmluZzsgbGFzdE5hbWU/OiBzdHJpbmc7IGVtYWlsPzogc3RyaW5nIH07XHJcbn07XHJcblxyXG50eXBlIEh1YnNwb3RXaXRoQWN0aW9ucyA9IHtcclxuICBhY3Rpb25zPzoge1xyXG4gICAgb3BlblVybD86IChhcmdzOiB7IHVybDogc3RyaW5nIH0pID0+IFByb21pc2U8dm9pZD47XHJcbiAgfTtcclxufTtcclxuXHJcbnR5cGUgQWRkQWxlcnRGbiA9IChhcmdzOiB7XHJcbiAgbWVzc2FnZTogc3RyaW5nO1xyXG4gIHR5cGU/OiBcImluZm9cIiB8IFwic3VjY2Vzc1wiIHwgXCJ3YXJuaW5nXCIgfCBcImRhbmdlclwiO1xyXG4gIHRpdGxlPzogc3RyaW5nO1xyXG59KSA9PiB2b2lkO1xyXG5cclxudHlwZSBBcGlXaXRoQWRkQWxlcnQgPSB7XHJcbiAgY29udGV4dDogdW5rbm93bjtcclxuICBhY3Rpb25zPzoge1xyXG4gICAgYWRkQWxlcnQ/OiBBZGRBbGVydEZuO1xyXG4gIH07XHJcbn07XHJcblxyXG5mdW5jdGlvbiBnZXRFcnJvck1lc3NhZ2UoZXJyOiB1bmtub3duKTogc3RyaW5nIHtcclxuICBpZiAoZXJyIGluc3RhbmNlb2YgRXJyb3IpIHJldHVybiBlcnIubWVzc2FnZTtcclxuICBpZiAodHlwZW9mIGVyciA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIGVycjtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGVycik7XHJcbiAgfSBjYXRjaCB7XHJcbiAgICByZXR1cm4gU3RyaW5nKGVycik7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICog4pyFIEZJWDogRG8gTk9UIHR5cGUgZGVzdHJ1Y3R1cmVkIGFyZ3MuXHJcbiAqIEh1YlNwb3QgYXBpL2FjdGlvbnMgdHlwZXMgYXJlIHVuaW9ucyBhY3Jvc3MgZXh0ZW5zaW9uIHBvaW50cy5cclxuICogQWNjZXB0IGBhcGlgLCB0aGVuIHNhZmVseSBuYXJyb3cgdG8gYGFkZEFsZXJ0YC5cclxuICovXHJcbmh1YnNwb3QuZXh0ZW5kKChhcGkpID0+IHtcclxuICBjb25zdCB7IGNvbnRleHQsIGFjdGlvbnMgfSA9IGFwaSBhcyB1bmtub3duIGFzIEFwaVdpdGhBZGRBbGVydDtcclxuICByZXR1cm4gPEZlZVNoZWV0Q2FyZCBjb250ZXh0PXtjb250ZXh0fSBhZGRBbGVydD17YWN0aW9ucz8uYWRkQWxlcnR9IC8+O1xyXG59KTtcclxuXHJcbmNvbnN0IEJBQ0tFTkRfRU5EUE9JTlQgPSBcImh0dHBzOi8vZmVlLXNoZWV0LWJhY2tlbmQub25yZW5kZXIuY29tL2FwaS9mZWUtc2hlZXRcIjtcclxuY29uc3QgRVhDRUxfSUNPTl9VUkwgPVxyXG4gIFwiaHR0cHM6Ly81MDgwMjgxMC5mczEuaHVic3BvdHVzZXJjb250ZW50LW5hMS5uZXQvaHViZnMvNTA4MDI4MTAvZmlsZS5wbmdcIjtcclxuXHJcbmZ1bmN0aW9uIGJ1aWxkQmFja2VuZFVybChwYXJhbXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pIHtcclxuICBjb25zdCB1cmwgPSBuZXcgVVJMKEJBQ0tFTkRfRU5EUE9JTlQpO1xyXG4gIE9iamVjdC5lbnRyaWVzKHBhcmFtcykuZm9yRWFjaCgoW2ssIHZdKSA9PiB7XHJcbiAgICBpZiAodikgdXJsLnNlYXJjaFBhcmFtcy5zZXQoaywgdik7XHJcbiAgfSk7XHJcbiAgcmV0dXJuIHVybC50b1N0cmluZygpO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBjYWxsQmFja2VuZChwYXJhbXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pIHtcclxuICBjb25zdCB1cmwgPSBidWlsZEJhY2tlbmRVcmwocGFyYW1zKTtcclxuXHJcbiAgY29uc3QgcmVzID0gYXdhaXQgaHVic3BvdC5mZXRjaCh1cmwsIHtcclxuICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgIHRpbWVvdXQ6IDEyXzAwMCxcclxuICB9KTtcclxuXHJcbiAgaWYgKCFyZXMub2spIHtcclxuICAgIGNvbnN0IHRleHQgPSBhd2FpdCByZXMudGV4dCgpO1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBCYWNrZW5kIGVycm9yICR7cmVzLnN0YXR1c306ICR7dGV4dH1gKTtcclxuICB9XHJcblxyXG4gIHJldHVybiByZXMuanNvbigpO1xyXG59XHJcblxyXG4vKiAtLS0tLS0tLS0tIFN0YXR1cyAtLS0tLS0tLS0tICovXHJcblxyXG5mdW5jdGlvbiBidWlsZERvdFN2Z0RhdGFVcmkoY29sb3I6IHN0cmluZykge1xyXG4gIGNvbnN0IHN2ZyA9IGA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjEwXCIgaGVpZ2h0PVwiMTBcIiB2aWV3Qm94PVwiMCAwIDEwIDEwXCI+XHJcbiAgICA8Y2lyY2xlIGN4PVwiNVwiIGN5PVwiNVwiIHI9XCI0XCIgZmlsbD1cIiR7Y29sb3J9XCIgc3Ryb2tlPVwiJHtjb2xvcn1cIiBzdHJva2Utd2lkdGg9XCIyXCIgLz5cclxuICA8L3N2Zz5gO1xyXG5cclxuICBjb25zdCBlbmNvZGVkID0gZW5jb2RlVVJJQ29tcG9uZW50KHN2ZylcclxuICAgIC5yZXBsYWNlKC8nL2csIFwiJTI3XCIpXHJcbiAgICAucmVwbGFjZSgvXCIvZywgXCIlMjJcIik7XHJcblxyXG4gIHJldHVybiBgZGF0YTppbWFnZS9zdmcreG1sLCR7ZW5jb2RlZH1gO1xyXG59XHJcblxyXG5mdW5jdGlvbiBTdGF0dXNUYWcoe1xyXG4gIGxhYmVsLFxyXG4gIHRvbmUgPSBcIndhcm5pbmdcIixcclxufToge1xyXG4gIGxhYmVsOiBzdHJpbmc7XHJcbiAgdG9uZT86IFwid2FybmluZ1wiIHwgXCJtdXRlZFwiIHwgXCJzdWNjZXNzXCIgfCBcImVycm9yXCI7XHJcbn0pIHtcclxuICBjb25zdCBzdHlsZXNCeVRvbmU6IFJlY29yZDxzdHJpbmcsIHsgZG90Q29sb3I6IHN0cmluZyB9PiA9IHtcclxuICAgIHdhcm5pbmc6IHsgZG90Q29sb3I6IFwiI0Y1QzI2QlwiIH0sXHJcbiAgICBtdXRlZDogeyBkb3RDb2xvcjogXCIjQ0JENUUxXCIgfSxcclxuICAgIHN1Y2Nlc3M6IHsgZG90Q29sb3I6IFwiIzIyQzU1RVwiIH0sXHJcbiAgICBlcnJvcjogeyBkb3RDb2xvcjogXCIjRUY0NDQ0XCIgfSxcclxuICB9O1xyXG5cclxuICBjb25zdCBzID0gc3R5bGVzQnlUb25lW3RvbmVdIHx8IHN0eWxlc0J5VG9uZS53YXJuaW5nO1xyXG4gIGNvbnN0IGRvdFNyYyA9IHVzZU1lbW8oKCkgPT4gYnVpbGREb3RTdmdEYXRhVXJpKHMuZG90Q29sb3IpLCBbcy5kb3RDb2xvcl0pO1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPEZsZXggZGlyZWN0aW9uPVwicm93XCIgYWxpZ249XCJiYXNlbGluZVwiIGdhcD1cInhzXCI+XHJcbiAgICAgIDxJbWFnZSBzcmM9e2RvdFNyY30gYWx0PVwiXCIgd2lkdGg9ezEwfSAvPlxyXG4gICAgICA8VGV4dCB2YXJpYW50PVwibWljcm9jb3B5XCIgZm9ybWF0PXt7IGZvbnRXZWlnaHQ6IFwiYm9sZFwiIH19PlxyXG4gICAgICAgIHtsYWJlbH1cclxuICAgICAgPC9UZXh0PlxyXG4gICAgPC9GbGV4PlxyXG4gICk7XHJcbn1cclxuXHJcbi8qIC0tLS0tLS0tLS0gQ2FyZCAtLS0tLS0tLS0tICovXHJcblxyXG5mdW5jdGlvbiBGZWVTaGVldENhcmQoe1xyXG4gIGNvbnRleHQsXHJcbiAgYWRkQWxlcnQsXHJcbn06IHtcclxuICBjb250ZXh0OiB1bmtub3duO1xyXG4gIGFkZEFsZXJ0PzogQWRkQWxlcnRGbjtcclxufSkge1xyXG4gIGNvbnN0IGN0eCA9IGNvbnRleHQgYXMgSHViU3BvdENvbnRleHQ7XHJcblxyXG4gIGNvbnN0IFtzdGF0dXMsIHNldFN0YXR1c10gPSB1c2VTdGF0ZShcIlwiKTtcclxuICBjb25zdCBbaXNMb2FkaW5nLCBzZXRJc0xvYWRpbmddID0gdXNlU3RhdGUodHJ1ZSk7XHJcblxyXG4gIGNvbnN0IFtmZWVTaGVldFVybCwgc2V0RmVlU2hlZXRVcmxdID0gdXNlU3RhdGUoXCJcIik7XHJcbiAgY29uc3QgW2ZlZVNoZWV0RmlsZU5hbWUsIHNldEZlZVNoZWV0RmlsZU5hbWVdID0gdXNlU3RhdGUoXCJcIik7XHJcbiAgY29uc3QgW2ZlZVNoZWV0Q3JlYXRlZEJ5LCBzZXRGZWVTaGVldENyZWF0ZWRCeV0gPSB1c2VTdGF0ZShcIlwiKTtcclxuICBjb25zdCBbbGFzdFVwZGF0ZWRBdCwgc2V0TGFzdFVwZGF0ZWRBdF0gPSB1c2VTdGF0ZShcIlwiKTtcclxuICBjb25zdCBbc3BDcmVhdGVkQXQsIHNldFNwQ3JlYXRlZEF0XSA9IHVzZVN0YXRlKFwiXCIpO1xyXG4gIGNvbnN0IFtzcExhc3RNb2RpZmllZEF0LCBzZXRTcExhc3RNb2RpZmllZEF0XSA9IHVzZVN0YXRlKFwiXCIpO1xyXG4gIGNvbnN0IFtsYXN0U3luY2VkQXQsIHNldExhc3RTeW5jZWRBdF0gPSB1c2VTdGF0ZShcIlwiKTtcclxuXHJcbiAgLy8gcHJvcG9zYWwgbWV0YWRhdGFcclxuICBjb25zdCBbcmVhZHlBdCwgc2V0UmVhZHlBdF0gPSB1c2VTdGF0ZShcIlwiKTtcclxuICBjb25zdCBbcmVhZHlCeSwgc2V0UmVhZHlCeV0gPSB1c2VTdGF0ZShcIlwiKTtcclxuXHJcbiAgY29uc3QgW2lzVG9nZ2xpbmdSZWFkeSwgc2V0SXNUb2dnbGluZ1JlYWR5XSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuICBjb25zdCBbaXNTeW5jaW5nTm93LCBzZXRJc1N5bmNpbmdOb3ddID0gdXNlU3RhdGUoZmFsc2UpO1xyXG4gIGNvbnN0IFtpc0RlbGV0aW5nLCBzZXRJc0RlbGV0aW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuXHJcbiAgY29uc3QgW3Byb3Bvc2FsU2VudExvY2tlZCwgc2V0UHJvcG9zYWxTZW50TG9ja2VkXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuXHJcbiAgY29uc3Qgb2JqZWN0SWQgPSBjdHguY3JtPy5vYmplY3RJZCB8fCBjdHguY3JtPy5yZWNvcmRJZCB8fCBjdHgub2JqZWN0SWQgfHwgXCJcIjtcclxuXHJcbiAgY29uc3QgY3JlYXRlZEJ5Rm9yUmVxdWVzdCA9IHVzZU1lbW8oKCkgPT4ge1xyXG4gICAgY29uc3QgZmlyc3QgPSBjdHgudXNlcj8uZmlyc3ROYW1lIHx8IFwiXCI7XHJcbiAgICBjb25zdCBsYXN0ID0gY3R4LnVzZXI/Lmxhc3ROYW1lIHx8IFwiXCI7XHJcbiAgICByZXR1cm4gYCR7Zmlyc3R9ICR7bGFzdH1gLnRyaW0oKSB8fCBjdHgudXNlcj8uZW1haWwgfHwgXCJVbmtub3duIHVzZXJcIjtcclxuICB9LCBbY3R4LnVzZXI/LmZpcnN0TmFtZSwgY3R4LnVzZXI/Lmxhc3ROYW1lLCBjdHgudXNlcj8uZW1haWxdKTtcclxuXHJcbiAgY29uc3QgY2FuT3BlbiA9IGZlZVNoZWV0VXJsLnN0YXJ0c1dpdGgoXCJodHRwXCIpO1xyXG5cclxuICBjb25zdCBvcGVuRmVlU2hlZXQgPSBhc3luYyAoKSA9PiB7XHJcbiAgICBpZiAoIWNhbk9wZW4pIHJldHVybjtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBocyA9IGh1YnNwb3QgYXMgdW5rbm93biBhcyBIdWJzcG90V2l0aEFjdGlvbnM7XHJcbiAgICAgIGlmIChocy5hY3Rpb25zPy5vcGVuVXJsKSB7XHJcbiAgICAgICAgYXdhaXQgaHMuYWN0aW9ucy5vcGVuVXJsKHsgdXJsOiBmZWVTaGVldFVybCB9KTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgIH0gY2F0Y2gge1xyXG4gICAgICAvLyBpZ25vcmUgYW5kIGZhbGwgYmFja1xyXG4gICAgfVxyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIHdpbmRvdz8ub3Blbikge1xyXG4gICAgICAgIHdpbmRvdy5vcGVuKGZlZVNoZWV0VXJsLCBcIl9ibGFua1wiLCBcIm5vb3BlbmVyLG5vcmVmZXJyZXJcIik7XHJcbiAgICAgIH1cclxuICAgIH0gY2F0Y2gge1xyXG4gICAgICBzZXRTdGF0dXMoXCJDb3VsZCBub3Qgb3BlbiBmaWxlIGZyb20gdGhpcyBjYXJkIGVudmlyb25tZW50LlwiKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjb25zdCBhbGVydCA9IChcclxuICAgIHR5cGU6IFwic3VjY2Vzc1wiIHwgXCJkYW5nZXJcIiB8IFwiaW5mb1wiIHwgXCJ3YXJuaW5nXCIsXHJcbiAgICBtZXNzYWdlOiBzdHJpbmcsXHJcbiAgICB0aXRsZT86IHN0cmluZ1xyXG4gICkgPT4ge1xyXG4gICAgaWYgKGFkZEFsZXJ0KSBhZGRBbGVydCh7IHR5cGUsIG1lc3NhZ2UsIHRpdGxlIH0pO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IHJlbGF0aXZlVGltZSA9IChpc286IHN0cmluZykgPT4ge1xyXG4gICAgaWYgKCFpc28pIHJldHVybiBcIuKAlFwiO1xyXG4gICAgY29uc3QgZCA9IG5ldyBEYXRlKGlzbyk7XHJcbiAgICBpZiAoTnVtYmVyLmlzTmFOKGQuZ2V0VGltZSgpKSkgcmV0dXJuIGlzbztcclxuXHJcbiAgICBjb25zdCBtaW5zID0gTWF0aC5mbG9vcigoRGF0ZS5ub3coKSAtIGQuZ2V0VGltZSgpKSAvIDYwMDAwKTtcclxuICAgIGlmIChtaW5zIDwgMikgcmV0dXJuIFwianVzdCBub3dcIjtcclxuICAgIGlmIChtaW5zIDwgNjApIHJldHVybiBgJHttaW5zfSBtaW51dGVzIGFnb2A7XHJcbiAgICBjb25zdCBob3VycyA9IE1hdGguZmxvb3IobWlucyAvIDYwKTtcclxuICAgIGlmIChob3VycyA8IDI0KSByZXR1cm4gYCR7aG91cnN9IGhvdXJzIGFnb2A7XHJcbiAgICBjb25zdCBkYXlzID0gTWF0aC5mbG9vcihob3VycyAvIDI0KTtcclxuICAgIHJldHVybiBkYXlzID09PSAxID8gXCJ5ZXN0ZXJkYXlcIiA6IGAke2RheXN9IGRheXMgYWdvYDtcclxuICB9O1xyXG5cclxuICBjb25zdCBjb21wdXRlU3RhdHVzID0gKCkgPT4ge1xyXG4gICAgaWYgKCFmZWVTaGVldFVybCkgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgaWYgKHByb3Bvc2FsU2VudExvY2tlZCkge1xyXG4gICAgICByZXR1cm4geyB0b25lOiBcInN1Y2Nlc3NcIiBhcyBjb25zdCwgbGFiZWw6IFwiUmVhZHkgZm9yIHByb3Bvc2FsXCIgfTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjID0gbmV3IERhdGUoc3BDcmVhdGVkQXQpO1xyXG4gICAgY29uc3QgbSA9IG5ldyBEYXRlKHNwTGFzdE1vZGlmaWVkQXQpO1xyXG5cclxuICAgIGlmIChcclxuICAgICAgc3BDcmVhdGVkQXQgJiZcclxuICAgICAgc3BMYXN0TW9kaWZpZWRBdCAmJlxyXG4gICAgICAhTnVtYmVyLmlzTmFOKGMuZ2V0VGltZSgpKSAmJlxyXG4gICAgICAhTnVtYmVyLmlzTmFOKG0uZ2V0VGltZSgpKVxyXG4gICAgKSB7XHJcbiAgICAgIGNvbnN0IGRpZmYgPSBNYXRoLmFicyhtLmdldFRpbWUoKSAtIGMuZ2V0VGltZSgpKTtcclxuICAgICAgcmV0dXJuIGRpZmYgPD0gNjBfMDAwXHJcbiAgICAgICAgPyB7IHRvbmU6IFwiZXJyb3JcIiBhcyBjb25zdCwgbGFiZWw6IFwiTm90IHN0YXJ0ZWRcIiB9XHJcbiAgICAgICAgOiB7IHRvbmU6IFwid2FybmluZ1wiIGFzIGNvbnN0LCBsYWJlbDogXCJJbiBwcm9ncmVzc1wiIH07XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHsgdG9uZTogXCJ3YXJuaW5nXCIgYXMgY29uc3QsIGxhYmVsOiBcIkluIHByb2dyZXNzXCIgfTtcclxuICB9O1xyXG5cclxuICBjb25zdCBzdGF0dXNEaXNwbGF5ID0gY29tcHV0ZVN0YXR1cygpO1xyXG5cclxuICBhc3luYyBmdW5jdGlvbiBsb2FkRmVlU2hlZXRNZXRhKCkge1xyXG4gICAgY29uc3QgYm9keSA9IGF3YWl0IGNhbGxCYWNrZW5kKHtcclxuICAgICAgYWN0aW9uOiBcImdldFwiLFxyXG4gICAgICBvYmplY3RJZDogU3RyaW5nKG9iamVjdElkKSxcclxuICAgIH0pO1xyXG5cclxuICAgIHNldEZlZVNoZWV0VXJsKGJvZHk/LmZlZVNoZWV0VXJsIHx8IFwiXCIpO1xyXG4gICAgc2V0RmVlU2hlZXRGaWxlTmFtZShib2R5Py5mZWVTaGVldEZpbGVOYW1lIHx8IFwiXCIpO1xyXG4gICAgc2V0RmVlU2hlZXRDcmVhdGVkQnkoYm9keT8uZmVlU2hlZXRDcmVhdGVkQnkgfHwgXCJcIik7XHJcbiAgICBzZXRMYXN0VXBkYXRlZEF0KGJvZHk/Lmxhc3RVcGRhdGVkQXQgfHwgXCJcIik7XHJcbiAgICBzZXRTcENyZWF0ZWRBdChib2R5Py5zcENyZWF0ZWRBdCB8fCBcIlwiKTtcclxuICAgIHNldFNwTGFzdE1vZGlmaWVkQXQoYm9keT8uc3BMYXN0TW9kaWZpZWRBdCB8fCBcIlwiKTtcclxuICAgIHNldExhc3RTeW5jZWRBdChib2R5Py5mZWVTaGVldExhc3RTeW5jZWRBdCB8fCBcIlwiKTtcclxuXHJcbiAgICBjb25zdCBzZXJ2ZXJSZWFkeUF0ID1cclxuICAgICAgYm9keT8uZmVlX3NoZWV0X3JlYWR5X2F0IHx8IGJvZHk/LmZlZVNoZWV0UmVhZHlBdCB8fCBib2R5Py5yZWFkeUF0IHx8IFwiXCI7XHJcbiAgICBjb25zdCBzZXJ2ZXJSZWFkeUJ5ID1cclxuICAgICAgYm9keT8uZmVlX3NoZWV0X3JlYWR5X2J5IHx8IGJvZHk/LmZlZVNoZWV0UmVhZHlCeSB8fCBib2R5Py5yZWFkeUJ5IHx8IFwiXCI7XHJcblxyXG4gICAgc2V0UmVhZHlBdChzZXJ2ZXJSZWFkeUF0KTtcclxuICAgIHNldFJlYWR5Qnkoc2VydmVyUmVhZHlCeSk7XHJcblxyXG4gICAgY29uc3QgYmFja2VuZFJlYWR5ID0gQm9vbGVhbihib2R5Py5yZWFkeUZvclByb3Bvc2FsKTtcclxuICAgIHNldFByb3Bvc2FsU2VudExvY2tlZChiYWNrZW5kUmVhZHkpO1xyXG4gIH1cclxuXHJcbiAgLy8gSW5pdGlhbCBsb2FkXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIChhc3luYyAoKSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgYXdhaXQgbG9hZEZlZVNoZWV0TWV0YSgpO1xyXG4gICAgICB9IGNhdGNoIChlOiB1bmtub3duKSB7XHJcbiAgICAgICAgc2V0U3RhdHVzKGBMb2FkIGVycm9yOiAke2dldEVycm9yTWVzc2FnZShlKX1gKTtcclxuICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICBzZXRJc0xvYWRpbmcoZmFsc2UpO1xyXG4gICAgICB9XHJcbiAgICB9KSgpO1xyXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWhvb2tzL2V4aGF1c3RpdmUtZGVwc1xyXG4gIH0sIFtdKTtcclxuXHJcbiAgLy8gQXV0by1wb2xsXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmICghY2FuT3BlbikgcmV0dXJuO1xyXG4gICAgaWYgKGlzTG9hZGluZykgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IFBPTExfTVMgPSAyMF8wMDA7XHJcblxyXG4gICAgY29uc3QgaWQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgIGlmIChpc1RvZ2dsaW5nUmVhZHkgfHwgaXNTeW5jaW5nTm93IHx8IGlzRGVsZXRpbmcpIHJldHVybjtcclxuICAgICAgbG9hZEZlZVNoZWV0TWV0YSgpLmNhdGNoKCgpID0+IHtcclxuICAgICAgICAvLyBzaWxlbnRcclxuICAgICAgfSk7XHJcbiAgICB9LCBQT0xMX01TKTtcclxuXHJcbiAgICByZXR1cm4gKCkgPT4gY2xlYXJJbnRlcnZhbChpZCk7XHJcbiAgfSwgW2Nhbk9wZW4sIGlzTG9hZGluZywgaXNUb2dnbGluZ1JlYWR5LCBpc1N5bmNpbmdOb3csIGlzRGVsZXRpbmcsIG9iamVjdElkXSk7XHJcblxyXG4gIGFzeW5jIGZ1bmN0aW9uIG9uQ3JlYXRlKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgc2V0SXNMb2FkaW5nKHRydWUpO1xyXG4gICAgICBzZXRTdGF0dXMoXCJcIik7XHJcblxyXG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgY2FsbEJhY2tlbmQoe1xyXG4gICAgICAgIGFjdGlvbjogXCJjcmVhdGVcIixcclxuICAgICAgICBvYmplY3RJZDogU3RyaW5nKG9iamVjdElkKSxcclxuICAgICAgICBjcmVhdGVkQnk6IGNyZWF0ZWRCeUZvclJlcXVlc3QsXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgYWxlcnQoXCJzdWNjZXNzXCIsIGJvZHk/Lm1lc3NhZ2UgfHwgXCJGZWUgc2hlZXQgY3JlYXRlZC5cIiwgXCJDcmVhdGVkXCIpO1xyXG4gICAgICBzZXRTdGF0dXMoXCJcIik7XHJcbiAgICAgIGF3YWl0IGxvYWRGZWVTaGVldE1ldGEoKTtcclxuICAgIH0gY2F0Y2ggKGU6IHVua25vd24pIHtcclxuICAgICAgY29uc3QgbXNnID0gZ2V0RXJyb3JNZXNzYWdlKGUpO1xyXG4gICAgICBhbGVydChcImRhbmdlclwiLCBtc2csIFwiQ3JlYXRlIGZhaWxlZFwiKTtcclxuICAgICAgc2V0U3RhdHVzKGBFcnJvcjogJHttc2d9YCk7XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICBzZXRJc0xvYWRpbmcoZmFsc2UpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgZnVuY3Rpb24gb25TeW5jTm93KCkge1xyXG4gICAgaWYgKGlzU3luY2luZ05vdyB8fCBpc1RvZ2dsaW5nUmVhZHkgfHwgaXNMb2FkaW5nIHx8IGlzRGVsZXRpbmcpIHJldHVybjtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBzZXRJc1N5bmNpbmdOb3codHJ1ZSk7XHJcbiAgICAgIHNldFN0YXR1cyhcIlwiKTtcclxuXHJcbiAgICAgIGNvbnN0IGJvZHkgPSBhd2FpdCBjYWxsQmFja2VuZCh7XHJcbiAgICAgICAgYWN0aW9uOiBcInJlZnJlc2hcIixcclxuICAgICAgICBvYmplY3RJZDogU3RyaW5nKG9iamVjdElkKSxcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpZiAoYm9keT8uZmVlU2hlZXRMYXN0U3luY2VkQXQpIHNldExhc3RTeW5jZWRBdChib2R5LmZlZVNoZWV0TGFzdFN5bmNlZEF0KTtcclxuXHJcbiAgICAgIGFsZXJ0KFwic3VjY2Vzc1wiLCBib2R5Py5tZXNzYWdlIHx8IFwiU3luY2VkIHN1Y2Nlc3NmdWxseS5cIiwgXCJTeW5jIGNvbXBsZXRlXCIpO1xyXG4gICAgICBzZXRTdGF0dXMoXCJcIik7XHJcbiAgICAgIGF3YWl0IGxvYWRGZWVTaGVldE1ldGEoKTtcclxuICAgIH0gY2F0Y2ggKGU6IHVua25vd24pIHtcclxuICAgICAgY29uc3QgbXNnID0gZ2V0RXJyb3JNZXNzYWdlKGUpO1xyXG4gICAgICBhbGVydChcImRhbmdlclwiLCBtc2csIFwiU3luYyBmYWlsZWRcIik7XHJcbiAgICAgIHNldFN0YXR1cyhgRXJyb3I6ICR7bXNnfWApO1xyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgc2V0SXNTeW5jaW5nTm93KGZhbHNlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFzeW5jIGZ1bmN0aW9uIG9uU2VuZFByb3Bvc2FsKCkge1xyXG4gICAgaWYgKGlzVG9nZ2xpbmdSZWFkeSB8fCBwcm9wb3NhbFNlbnRMb2NrZWQgfHwgaXNEZWxldGluZykgcmV0dXJuO1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIHNldElzVG9nZ2xpbmdSZWFkeSh0cnVlKTtcclxuICAgICAgc2V0U3RhdHVzKFwiXCIpO1xyXG5cclxuICAgICAgY29uc3QgYm9keSA9IGF3YWl0IGNhbGxCYWNrZW5kKHtcclxuICAgICAgICBhY3Rpb246IFwic2V0LXJlYWR5XCIsXHJcbiAgICAgICAgb2JqZWN0SWQ6IFN0cmluZyhvYmplY3RJZCksXHJcbiAgICAgICAgcmVhZHk6IFwidHJ1ZVwiLFxyXG4gICAgICAgIHVwZGF0ZWRCeTogY3JlYXRlZEJ5Rm9yUmVxdWVzdCxcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBhbGVydChcInN1Y2Nlc3NcIiwgYm9keT8ubWVzc2FnZSB8fCBcIk1hcmtlZCByZWFkeSBmb3IgcHJvcG9zYWwuXCIsIFwiVXBkYXRlZFwiKTtcclxuICAgICAgc2V0UHJvcG9zYWxTZW50TG9ja2VkKHRydWUpO1xyXG4gICAgICBhd2FpdCBsb2FkRmVlU2hlZXRNZXRhKCk7XHJcbiAgICB9IGNhdGNoIChlOiB1bmtub3duKSB7XHJcbiAgICAgIGNvbnN0IG1zZyA9IGdldEVycm9yTWVzc2FnZShlKTtcclxuICAgICAgYWxlcnQoXCJkYW5nZXJcIiwgbXNnLCBcIlVwZGF0ZSBmYWlsZWRcIik7XHJcbiAgICAgIHNldFN0YXR1cyhgRXJyb3I6ICR7bXNnfWApO1xyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgc2V0SXNUb2dnbGluZ1JlYWR5KGZhbHNlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFzeW5jIGZ1bmN0aW9uIG9uR29CYWNrVG9FZGl0aW5nKCkge1xyXG4gICAgaWYgKGlzVG9nZ2xpbmdSZWFkeSB8fCBpc0RlbGV0aW5nKSByZXR1cm47XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgc2V0SXNUb2dnbGluZ1JlYWR5KHRydWUpO1xyXG4gICAgICBzZXRTdGF0dXMoXCJcIik7XHJcblxyXG4gICAgICBhd2FpdCBjYWxsQmFja2VuZCh7XHJcbiAgICAgICAgYWN0aW9uOiBcInNldC1yZWFkeVwiLFxyXG4gICAgICAgIG9iamVjdElkOiBTdHJpbmcob2JqZWN0SWQpLFxyXG4gICAgICAgIHJlYWR5OiBcImZhbHNlXCIsXHJcbiAgICAgICAgdXBkYXRlZEJ5OiBjcmVhdGVkQnlGb3JSZXF1ZXN0LFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGFsZXJ0KFwic3VjY2Vzc1wiLCBcIlJlb3BlbmVkIGZvciBlZGl0cy5cIiwgXCJVcGRhdGVkXCIpO1xyXG4gICAgICBzZXRQcm9wb3NhbFNlbnRMb2NrZWQoZmFsc2UpO1xyXG4gICAgICBhd2FpdCBsb2FkRmVlU2hlZXRNZXRhKCk7XHJcbiAgICB9IGNhdGNoIChlOiB1bmtub3duKSB7XHJcbiAgICAgIGNvbnN0IG1zZyA9IGdldEVycm9yTWVzc2FnZShlKTtcclxuICAgICAgYWxlcnQoXCJkYW5nZXJcIiwgbXNnLCBcIlVwZGF0ZSBmYWlsZWRcIik7XHJcbiAgICAgIHNldFN0YXR1cyhgRXJyb3I6ICR7bXNnfWApO1xyXG4gICAgICBzZXRQcm9wb3NhbFNlbnRMb2NrZWQodHJ1ZSk7XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICBzZXRJc1RvZ2dsaW5nUmVhZHkoZmFsc2UpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgZnVuY3Rpb24gb25EZWxldGVGZWVTaGVldCgpIHtcclxuICAgIGlmIChpc0RlbGV0aW5nIHx8IGlzTG9hZGluZyB8fCBpc1N5bmNpbmdOb3cgfHwgaXNUb2dnbGluZ1JlYWR5KSByZXR1cm47XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgc2V0SXNEZWxldGluZyh0cnVlKTtcclxuICAgICAgc2V0U3RhdHVzKFwiXCIpO1xyXG5cclxuICAgICAgY29uc3QgYm9keSA9IGF3YWl0IGNhbGxCYWNrZW5kKHtcclxuICAgICAgICBhY3Rpb246IFwiZGV0YWNoXCIsIC8vIGJhY2tlbmQgbXVzdCBzdXBwb3J0IHRoaXNcclxuICAgICAgICBvYmplY3RJZDogU3RyaW5nKG9iamVjdElkKSxcclxuICAgICAgICB1cGRhdGVkQnk6IGNyZWF0ZWRCeUZvclJlcXVlc3QsXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgYWxlcnQoXCJzdWNjZXNzXCIsIGJvZHk/Lm1lc3NhZ2UgfHwgXCJGZWUgc2hlZXQgZGV0YWNoZWQuXCIsIFwiRGVsZXRlZFwiKTtcclxuICAgICAgc2V0UHJvcG9zYWxTZW50TG9ja2VkKGZhbHNlKTtcclxuICAgICAgYXdhaXQgbG9hZEZlZVNoZWV0TWV0YSgpOyAvLyBmbGlwcyBVSSB0byBDcmVhdGUgaWYgdXJsIGNsZWFyZWRcclxuICAgIH0gY2F0Y2ggKGU6IHVua25vd24pIHtcclxuICAgICAgY29uc3QgbXNnID0gZ2V0RXJyb3JNZXNzYWdlKGUpO1xyXG4gICAgICBhbGVydChcImRhbmdlclwiLCBtc2csIFwiRGVsZXRlIGZhaWxlZFwiKTtcclxuICAgICAgc2V0U3RhdHVzKGBFcnJvcjogJHttc2d9YCk7XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICBzZXRJc0RlbGV0aW5nKGZhbHNlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8RmxleCBkaXJlY3Rpb249XCJjb2x1bW5cIiBnYXA9XCJmbHVzaFwiPlxyXG4gICAgICB7aXNMb2FkaW5nID8gKFxyXG4gICAgICAgIDxUZXh0IHZhcmlhbnQ9XCJib2R5dGV4dFwiPkxvYWRpbmcgZmVlIHNoZWV04oCmPC9UZXh0PlxyXG4gICAgICApIDogIWNhbk9wZW4gPyAoXHJcbiAgICAgICAgPEJ1dHRvbiB2YXJpYW50PVwicHJpbWFyeVwiIG9uQ2xpY2s9e29uQ3JlYXRlfT5cclxuICAgICAgICAgIENyZWF0ZSBGZWUgU2hlZXRcclxuICAgICAgICA8L0J1dHRvbj5cclxuICAgICAgKSA6IChcclxuICAgICAgICA8PlxyXG4gICAgICAgICAgPEZsZXggZGlyZWN0aW9uPVwiY29sdW1uXCIgZ2FwPVwieHNcIj5cclxuICAgICAgICAgICAgey8qIFN0YXR1cyArIGhlYWRlciBhY3Rpb25zICovfVxyXG4gICAgICAgICAgICA8RmxleCBkaXJlY3Rpb249XCJjb2x1bW5cIiBnYXA9XCJmbHVzaFwiIGp1c3RpZnk9XCJzdGFydFwiPlxyXG4gICAgICAgICAgICAgIDxGbGV4IGRpcmVjdGlvbj1cInJvd1wiIGFsaWduPVwiY2VudGVyXCIganVzdGlmeT1cInN0YXJ0XCIgZ2FwPVwiZmx1c2hcIj5cclxuICAgICAgICAgICAgICAgIHtzdGF0dXNEaXNwbGF5ICYmIChcclxuICAgICAgICAgICAgICAgICAgPFN0YXR1c1RhZ1xyXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsPXtzdGF0dXNEaXNwbGF5LmxhYmVsfVxyXG4gICAgICAgICAgICAgICAgICAgIHRvbmU9e3N0YXR1c0Rpc3BsYXkudG9uZX1cclxuICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICl9XHJcblxyXG4gICAgICAgICAgICAgICAgey8qIOKchSBBbHdheXMgc2hvdyBEZWxldGUgd2hlbiBhIGZlZSBzaGVldCBleGlzdHMgKi99XHJcbiAgICAgICAgICAgICAgICA8QnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJ0cmFuc3BhcmVudFwiXHJcbiAgICAgICAgICAgICAgICAgIHNpemU9XCJtZFwiXHJcbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e29uRGVsZXRlRmVlU2hlZXR9XHJcbiAgICAgICAgICAgICAgICAgIGxvYWRpbmc9e2lzRGVsZXRpbmd9XHJcbiAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXtpc1RvZ2dsaW5nUmVhZHkgfHwgaXNTeW5jaW5nTm93IHx8IGlzTG9hZGluZ31cclxuICAgICAgICAgICAgICAgICAgb3ZlcmxheT17PFRvb2x0aXAgcGxhY2VtZW50PVwidG9wXCI+RGVsZXRlPC9Ub29sdGlwPn1cclxuICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgPEljb24gbmFtZT1cImRlbGV0ZVwiIC8+XHJcbiAgICAgICAgICAgICAgICA8L0J1dHRvbj5cclxuXHJcbiAgICAgICAgICAgICAgICB7Lyog4pyFIE9ubHkgc2hvdyBcIlJlb3BlblwiIHdoZW4gbG9ja2VkICovfVxyXG4gICAgICAgICAgICAgICAge3Byb3Bvc2FsU2VudExvY2tlZCAmJiAoXHJcbiAgICAgICAgICAgICAgICAgIDxCdXR0b25cclxuICAgICAgICAgICAgICAgICAgICB2YXJpYW50PVwidHJhbnNwYXJlbnRcIlxyXG4gICAgICAgICAgICAgICAgICAgIHNpemU9XCJtZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17b25Hb0JhY2tUb0VkaXRpbmd9XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9e2lzVG9nZ2xpbmdSZWFkeSB8fCBpc1N5bmNpbmdOb3cgfHwgaXNEZWxldGluZ31cclxuICAgICAgICAgICAgICAgICAgICBvdmVybGF5PXs8VG9vbHRpcCBwbGFjZW1lbnQ9XCJ0b3BcIj5SZW9wZW4gZm9yIGVkaXRzPC9Ub29sdGlwPn1cclxuICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgIDxJY29uIG5hbWU9XCJlZGl0XCIgLz5cclxuICAgICAgICAgICAgICAgICAgPC9CdXR0b24+XHJcbiAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgIDwvRmxleD5cclxuXHJcbiAgICAgICAgICAgICAge3Byb3Bvc2FsU2VudExvY2tlZCA/IChcclxuICAgICAgICAgICAgICAgIDxUZXh0IHZhcmlhbnQ9XCJtaWNyb2NvcHlcIj5cclxuICAgICAgICAgICAgICAgICAgQXBwcm92ZWQ6e1wiIFwifVxyXG4gICAgICAgICAgICAgICAgICA8VGV4dCBpbmxpbmUgdmFyaWFudD1cIm1pY3JvY29weVwiIGZvcm1hdD17eyBpdGFsaWM6IHRydWUgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAge3JlbGF0aXZlVGltZShyZWFkeUF0IHx8IGxhc3RVcGRhdGVkQXQpfVxyXG4gICAgICAgICAgICAgICAgICA8L1RleHQ+e1wiIFwifVxyXG4gICAgICAgICAgICAgICAgICBieXtcIiBcIn1cclxuICAgICAgICAgICAgICAgICAgPFRleHQgaW5saW5lIHZhcmlhbnQ9XCJtaWNyb2NvcHlcIiBmb3JtYXQ9e3sgaXRhbGljOiB0cnVlIH19PlxyXG4gICAgICAgICAgICAgICAgICAgIHtyZWFkeUJ5IHx8IFwi4oCUXCJ9XHJcbiAgICAgICAgICAgICAgICAgIDwvVGV4dD5cclxuICAgICAgICAgICAgICAgIDwvVGV4dD5cclxuICAgICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgICAgPD48Lz5cclxuICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICA8L0ZsZXg+XHJcblxyXG4gICAgICAgICAgICB7LyogRmlsZSB0aWxlICovfVxyXG4gICAgICAgICAgICA8VGlsZSBjb21wYWN0PXt0cnVlfT5cclxuICAgICAgICAgICAgICA8RmxleCBkaXJlY3Rpb249XCJyb3dcIiBhbGlnbj1cImJhc2VsaW5lXCIgZ2FwPVwic21cIiBqdXN0aWZ5PVwic3RhcnRcIj5cclxuICAgICAgICAgICAgICAgIDxJbWFnZSBzcmM9e0VYQ0VMX0lDT05fVVJMfSBhbHQ9XCJFeGNlbFwiIHdpZHRoPXszNH0gLz5cclxuICAgICAgICAgICAgICAgIDxMaW5rXHJcbiAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJwcmltYXJ5XCJcclxuICAgICAgICAgICAgICAgICAgaHJlZj17eyB1cmw6IGZlZVNoZWV0VXJsLCBleHRlcm5hbDogdHJ1ZSB9fVxyXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXtvcGVuRmVlU2hlZXR9XHJcbiAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgIHtmZWVTaGVldEZpbGVOYW1lIHx8IFwiRmVlIFNoZWV0XCJ9XHJcbiAgICAgICAgICAgICAgICA8L0xpbms+XHJcbiAgICAgICAgICAgICAgPC9GbGV4PlxyXG4gICAgICAgICAgICA8L1RpbGU+XHJcblxyXG4gICAgICAgICAgICB7LyogQWN0aW9ucyAqL31cclxuICAgICAgICAgICAgPEZsZXggZGlyZWN0aW9uPVwiY29sdW1uXCIgZ2FwPVwieHNcIj5cclxuICAgICAgICAgICAgICA8QnV0dG9uUm93PlxyXG4gICAgICAgICAgICAgICAgeyFwcm9wb3NhbFNlbnRMb2NrZWQgPyAoXHJcbiAgICAgICAgICAgICAgICAgIDxMb2FkaW5nQnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyaWFudD1cInByaW1hcnlcIlxyXG4gICAgICAgICAgICAgICAgICAgIHNpemU9XCJtZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17b25TZW5kUHJvcG9zYWx9XHJcbiAgICAgICAgICAgICAgICAgICAgbG9hZGluZz17aXNUb2dnbGluZ1JlYWR5fVxyXG4gICAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXtpc0xvYWRpbmcgfHwgcHJvcG9zYWxTZW50TG9ja2VkIHx8IGlzU3luY2luZ05vdyB8fCBpc0RlbGV0aW5nfVxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdEljb25OYW1lPVwic3VjY2Vzc1wiXHJcbiAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICA8SWNvbiBuYW1lPVwibm90aWZpY2F0aW9uXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICBBcHByb3ZlXHJcbiAgICAgICAgICAgICAgICAgIDwvTG9hZGluZ0J1dHRvbj5cclxuICAgICAgICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgICAgICAgIDw+PC8+XHJcbiAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgIDwvQnV0dG9uUm93PlxyXG5cclxuICAgICAgICAgICAgICB7cHJvcG9zYWxTZW50TG9ja2VkID8gKFxyXG4gICAgICAgICAgICAgICAgPEZsZXggZGlyZWN0aW9uPVwiY29sdW1uXCIgZ2FwPVwieHNcIj5cclxuICAgICAgICAgICAgICAgICAgPEZsZXggZGlyZWN0aW9uPVwicm93XCIgYWxpZ249XCJjZW50ZXJcIiBqdXN0aWZ5PVwic3RhcnRcIiBnYXA9XCJ4c1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxMb2FkaW5nQnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICB2YXJpYW50PVwic2Vjb25kYXJ5XCJcclxuICAgICAgICAgICAgICAgICAgICAgIHNpemU9XCJ4c1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtvblN5bmNOb3d9XHJcbiAgICAgICAgICAgICAgICAgICAgICBsb2FkaW5nPXtpc1N5bmNpbmdOb3d9XHJcbiAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZD17aXNUb2dnbGluZ1JlYWR5IHx8IGlzTG9hZGluZyB8fCBpc0RlbGV0aW5nfVxyXG4gICAgICAgICAgICAgICAgICAgICAgcmVzdWx0SWNvbk5hbWU9XCJzdWNjZXNzXCJcclxuICAgICAgICAgICAgICAgICAgICAgIG92ZXJsYXk9ezxUb29sdGlwIHBsYWNlbWVudD1cInRvcFwiPlJlc3luYzwvVG9vbHRpcD59XHJcbiAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPEljb24gbmFtZT1cInJlZnJlc2hcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvTG9hZGluZ0J1dHRvbj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgPFRleHQgdmFyaWFudD1cIm1pY3JvY29weVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgTGFzdCBzeW5jZWQ6IHtsYXN0U3luY2VkQXQgPyByZWxhdGl2ZVRpbWUobGFzdFN5bmNlZEF0KSA6IFwi4oCUXCJ9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9UZXh0PlxyXG4gICAgICAgICAgICAgICAgICA8L0ZsZXg+XHJcbiAgICAgICAgICAgICAgICA8L0ZsZXg+XHJcbiAgICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgIDxGbGV4IGRpcmVjdGlvbj1cInJvd1wiIGFsaWduPVwiYmFzZWxpbmVcIiBnYXA9XCJ4c1wiPlxyXG4gICAgICAgICAgICAgICAgICA8VGV4dCB2YXJpYW50PVwibWljcm9jb3B5XCI+UG9zdHMgdG8gI3Byb3Bvc2FsczwvVGV4dD5cclxuICAgICAgICAgICAgICAgIDwvRmxleD5cclxuICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICA8L0ZsZXg+XHJcbiAgICAgICAgICA8L0ZsZXg+XHJcbiAgICAgICAgPC8+XHJcbiAgICAgICl9XHJcblxyXG4gICAgICB7LyogS2VlcCBpbmxpbmUgc3RhdHVzIG9ubHkgZm9yIGVycm9ycyAqL31cclxuICAgICAge3N0YXR1cyAmJiA8VGV4dCB2YXJpYW50PVwiYm9keXRleHRcIj57c3RhdHVzfTwvVGV4dD59XHJcbiAgICA8L0ZsZXg+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRmVlU2hlZXRDYXJkO1xyXG4iXSwibmFtZXMiOlsiUmVhY3QiLCJyZXF1aXJlJCQwIiwiUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZSIsInNlbGYiLCJqc3hSdW50aW1lTW9kdWxlIiwiY3JlYXRlUmVtb3RlUmVhY3RDb21wb25lbnQiLCJfanN4IiwiY3JlYXRlQ29udGV4dCIsInVzZU1lbW8iLCJ1c2VTdGF0ZSIsIl9hIiwiX2IiLCJfYyIsInVzZUVmZmVjdCJdLCJtYXBwaW5ncyI6Ijs7O0FBSUEsUUFBTSxvQkFBb0IsTUFBTSxPQUFPLFNBQVMsZUFDNUMsS0FBSyxpQ0FBaUM7QUFJMUMsUUFBTSxvQkFBb0I7QUFBQSxJQUN0QixRQUFRO0FBQUEsTUFDSixPQUFPLENBQUMsU0FBUztBQUNiLGdCQUFRLElBQUksSUFBSTtBQUFBLE1BQ3BCO0FBQUEsTUFDQSxNQUFNLENBQUMsU0FBUztBQUNaLGdCQUFRLEtBQUssSUFBSTtBQUFBLE1BQ3JCO0FBQUEsTUFDQSxNQUFNLENBQUMsU0FBUztBQUNaLGdCQUFRLEtBQUssSUFBSTtBQUFBLE1BQ3JCO0FBQUEsTUFDQSxPQUFPLENBQUMsU0FBUztBQUNiLGdCQUFRLE1BQU0sSUFBSTtBQUFBLE1BQ3RCO0FBQUEsSUFDUjtBQUFBLElBQ0ksV0FBVyxNQUFNO0FBQUEsSUFFakI7QUFBQTtBQUFBLElBRUEsdUJBQXVCLE1BQU07QUFBQSxJQUU3QjtBQUFBLEVBQ0o7QUFLTyxRQUFNLG1CQUFtQixNQUFNO0FBQ2xDLFdBQU8sa0JBQWlCLElBQ2xCLE9BQ0E7QUFBQSxFQUNWO0FDdENBLFFBQU0sWUFBWSxpQkFBZ0IsRUFBRztBQUM5QixXQUFTLFdBQVcsTUFBTSxTQUFTO0FBQ3RDLFdBQU8sS0FBSyxXQUFXLE1BQU0sT0FBTztBQUFBLEVBQ3hDO0FBQ08sV0FBUyxNQUFNLEtBQUssU0FBUztBQUNoQyxXQUFP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
