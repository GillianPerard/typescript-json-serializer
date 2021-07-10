<a name="3.4.4"></a>
# 3.4.4 (2021-07-10)

### Bug fixes

* **deps:** move `tslib` from `devDependencies` to `dependencies` to avoid the following error: `"export '__spreadArray' (imported as 'e') was not found in 'tslib'` ([#148](https://github.com/GillianPerard/typescript-json-serializer/issues/148)) ([5895ccf](https://github.com/GillianPerard/typescript-json-serializer/commit/5895ccff349cb5af1b5c5f82f10c73382d322d2d))

<a name="3.4.3"></a>
# 3.4.3 (2021-07-08)

### Refactors

* **getPropertyNames:** remove complexity by removing two loops ([6dd896a](https://github.com/GillianPerard/typescript-json-serializer/commit/6dd896acb9548cb0c8b145450dc778dce684331f))

<a name="3.4.2"></a>
# 3.4.2 (2021-07-02)

### Bug fixes

* **getPropertyNames:** remove class body before parsing ctor ([#145](https://github.com/GillianPerard/typescript-json-serializer/issues/145)) ([6ff839f](https://github.com/GillianPerard/typescript-json-serializer/commit/6ff839f0a252b8c7dd71485d3ee357447dfa8895))

<a name="3.4.1"></a>
# 3.4.1 (2021-06-11)

### Bug fixes

* **getPropertyNames:** improve regex to take in account Angular and React builds ([#132](https://github.com/GillianPerard/typescript-json-serializer/issues/132)) ([#135](https://github.com/GillianPerard/typescript-json-serializer/issues/135)) ([8470679](https://github.com/GillianPerard/typescript-json-serializer/commit/84706799a9e51aea17ddb6d42200af5bdcc3ed05))
* **docs:** add a section to explain how to use the library with CRA (create-react-app) ([#132](https://github.com/GillianPerard/typescript-json-serializer/issues/132)) ([2c0ddbc](https://github.com/GillianPerard/typescript-json-serializer/commit/2c0ddbc8793e44e1d8a6db00720e16df6a203df0))

<a name="3.4.0"></a>
# 3.4.0 (2021-06-08)

### Build

* remove sourcemaps ([b26db94](https://github.com/GillianPerard/typescript-json-serializer/commit/b26db94efa435b8285a42830db0255881bf55d7f))

### Features

* **deserialize:** allow json string as first parameter ([#141](https://github.com/GillianPerard/typescript-json-serializer/issues/141)) ([ff06ed1](https://github.com/GillianPerard/typescript-json-serializer/commit/ff06ed1b23c615c6004f3a9360205ef7241825b7))

<a name="3.3.0"></a>
# 3.3.0 (2021-04-20)

### Features

* **JsonProperty:** add required option ([#133](https://github.com/GillianPerard/typescript-json-serializer/issues/133)) ([efe933f](https://github.com/GillianPerard/typescript-json-serializer/commit/efe933fe42ba3ba8de0a1454ea1ce04bb98bc46a))

<a name="3.2.2"></a>
# 3.2.2 (2021-03-18)

### Build

* make the lib work for commonjs and ecmascript project ([#129](https://github.com/GillianPerard/typescript-json-serializer/issues/129)) ([37e1bf5](https://github.com/GillianPerard/typescript-json-serializer/commit/37e1bf53fbabc809259f830fe7b50d8db9335e66))

<a name="3.2.1"></a>
# 3.2.1 (2021-03-12)

### Bug fixes

* **serialize:** preserve the value of the instance on beforeSerialize ([#123](https://github.com/GillianPerard/typescript-json-serializer/issues/123)) ([8af4689](https://github.com/GillianPerard/typescript-json-serializer/commit/8af4689d58d47075458371c53ed721242cde8033))

<a name="3.2.0"></a>
# 3.2.0 (2021-03-10)

### Build

* add support for EcmaScript, CommonJs and UMD ([#125](https://github.com/GillianPerard/typescript-json-serializer/issues/125)) ([2c48030](https://github.com/GillianPerard/typescript-json-serializer/commit/2c48030a7300b1d4dee6c99647ac00f1844140d2))


<a name="3.1.0"></a>
# 3.1.0 (2021-02-25)

### Features

* **predicate:** add parentProperty param ([#121](https://github.com/GillianPerard/typescript-json-serializer/issues/121)) ([a1603ba](https://github.com/GillianPerard/typescript-json-serializer/commit/a1603ba21db36fa818c6cb6d6fa87cefe7e1cdbc))

<a name="3.0.0"></a>
# 3.0.0 (2021-01-22)

### Features

* **JsonProperty:** add beforeSerialize option ([#115](https://github.com/GillianPerard/typescript-json-serializer/issues/115)) ([35d3776](https://github.com/GillianPerard/typescript-json-serializer/commit/35d37762713d8490f1700c70f40a82aa09adc76b))

### BREAKING CHANGES

* onSerialize renamed by afterSerialize
* onDeserialize renamed by beforeDeserialize
* postDeserialize renamed by afterDeserialize

<a name="2.5.3"></a>
# 2.5.3 (2021-01-21)

### Bug fixes

* **getBaseClassNames:** merge class maps in the correct order ([#115](https://github.com/GillianPerard/typescript-json-serializer/issues/115)) ([5256176](https://github.com/GillianPerard/typescript-json-serializer/commit/525617647be7850008d548cf3036996207337bd1))

<a name="2.5.2"></a>
# 2.5.2 (2020-11-30)

### Features

* **errors:** improve messages ([#108](https://github.com/GillianPerard/typescript-json-serializer/issues/108)) ([32c59ed](https://github.com/GillianPerard/typescript-json-serializer/commit/32c59ed8a0d4bac8016624d6eeba636a6575c4e9))

<a name="2.5.1"></a>
# 2.5.1 (2020-11-28)

### Bug fixes

* **proto:** make IOProto and PredicateProto returning any ([#107](https://github.com/GillianPerard/typescript-json-serializer/issues/107)) ([79a531f](https://github.com/GillianPerard/typescript-json-serializer/commit/79a531f2cb517ccfcbd74a1172f734e0ff74708c))

<a name="2.5.0"></a>
# 2.5.0 (2020-11-11)

### Features

* **Serializable:** add formatPropertyNames option ([#91](https://github.com/GillianPerard/typescript-json-serializer/issues/91)) ([f2e9f63](https://github.com/GillianPerard/typescript-json-serializer/commit/f2e9f63ad8397f8e42283bacdcb619eb15560c8f))

<a name="2.4.1"></a>
# 2.4.1 (2020-11-09)

### Bug Fixes

* **castSimpleData:** handle null type ([93bc7b7](https://github.com/GillianPerard/typescript-json-serializer/commit/93bc7b746623a77b492b114af2333be0fdc61e10))

### Features

* **JSonProperty:** add IOProto and PredicateProto ([#98](https://github.com/GillianPerard/typescript-json-serializer/issues/98)) ([4c4dd6f](https://github.com/GillianPerard/typescript-json-serializer/commit/4c4dd6fbb5dea285ace80290e2323b02ecb3cdff)) (special thanks to [@sco974](https://github.com/sco974))

<a name="2.4.0"></a>
# 2.4.0 (2020-08-26)

### Features

* **JSonProperty:** add support for Dictionary ([#94](https://github.com/GillianPerard/typescript-json-serializer/issues/94)) ([81f3ca2](https://github.com/GillianPerard/typescript-json-serializer/commit/81f3ca2b1a05dae027b7b7454eea47c3bdd9fe50))

<a name="2.3.4"></a>
# 2.3.4 (2020-08-26)

### Bug Fixes

* **deserialize:** remove values from instance ([#95](https://github.com/GillianPerard/typescript-json-serializer/issues/95)) ([5719bc2](https://github.com/GillianPerard/typescript-json-serializer/commit/5719bc21bdd007c11bab6920cd5ae060475439d1))

<a name="2.3.3"></a>
# 2.3.3 (2020-07-31)

### Bug Fixes

* **security:** update lodash ([87a5037](https://github.com/GillianPerard/typescript-json-serializer/commit/87a5037b9b3c33c04089e1310349221eed0b763e))

<a name="2.3.2"></a>
# 2.3.2 (2020-07-02)

### Build

* remove tslib ([36a3bc6](https://github.com/GillianPerard/typescript-json-serializer/commit/36a3bc61349d05bfe44785af7ea643dc99c50950))

<a name="2.3.1"></a>
# 2.3.1 (2020-07-02)

### Build

* add tslib (importHelpers) and remove comments from js files ([f739250](https://github.com/GillianPerard/typescript-json-serializer/commit/f73925081f2f18067ab5827a85b0a827889ed813))

<a name="2.3.0"></a>
# 2.3.0 (2020-06-28)

### Features

* **deserialize:** add possibility to predicate an union type composed by custom classes and primitive types ([#80](https://github.com/GillianPerard/typescript-json-serializer/issues/80)) ([57d7f22](https://github.com/GillianPerard/typescript-json-serializer/commit/57d7f22342b1ed0d6c978798491d7a581bb2337e))

<a name="2.2.1"></a>
# 2.2.1 (2020-06-27)

### Bug Fixes

* support null values ([#83](https://github.com/GillianPerard/typescript-json-serializer/issues/83)) ([44dd35d](https://github.com/GillianPerard/typescript-json-serializer/commit/44dd35dba3e365abfd117354f1e049c90c498140))


<a name="2.2.0"></a>
# 2.2.0 (2020-05-17)

### Features

* **JsonProperty:** add postDeserialize option ([#77](https://github.com/GillianPerard/typescript-json-serializer/issues/77)) ([f9e47f6](https://github.com/GillianPerard/typescript-json-serializer/commit/f9e47f647876c148ae50f9cc2c7e487528b44a07))

<a name="2.1.0"></a>
# 2.1.0 (2020-05-01)

### Bug Fixes

* **castSimpleData:** test if data is not null or undefined before using toString method ([#73](https://github.com/GillianPerard/typescript-json-serializer/issues/73)) ([efb0574](https://github.com/GillianPerard/typescript-json-serializer/commit/efb0574c28e847780d6c1ea9d6681d258ec4ce4f))

### Features

* **JsonProperty:** add names option that allows the merge of some properties ([#72](https://github.com/GillianPerard/typescript-json-serializer/issues/72)) ([f590cf7](https://github.com/GillianPerard/typescript-json-serializer/commit/f590cf74c7d1bdc50fa29e0919ea1ec3dffae651))

<a name="2.0.0"></a>
# 2.0.0 (2020-04-18)

### Build

* create specific tsconfig build file ([acbf02c](https://github.com/GillianPerard/typescript-json-serializer/commit/acbf02c7adbeb4015a89c22fbc21f0ad2f7aa8a2))

### Features

* **Serializable:** add support for deep inheritance ([#64](https://github.com/GillianPerard/typescript-json-serializer/issues/64)) ([c89bb3a](https://github.com/GillianPerard/typescript-json-serializer/commit/c89bb3a0ef0f114bcb093dd8ec45c80a3654a9ef))

<a name="1.4.6"></a>
# 1.4.6 (2020-04-15)

### Build

* only build the src folder ([768cfa2](https://github.com/GillianPerard/typescript-json-serializer/commit/768cfa20c421c845d3ea9c82005ef57ff71e5c1a))

<a name="1.4.5"></a>
# 1.4.5 (2020-03-15)

### Bug Fixes

* **deserialize:** empty child class now has parent properties ([#58](https://github.com/GillianPerard/typescript-json-serializer/issues/58)) ([86f89c2](https://github.com/GillianPerard/typescript-json-serializer/commit/86f89c21ff32f84a274154438a36f575028566a7))

<a name="1.4.4"></a>
# 1.4.4 (2020-01-31)

### Bug Fixes

* **getParamNames:** improve constructor parameter pattern ([#55](https://github.com/GillianPerard/typescript-json-serializer/pull/55)) ([a9e2a74](https://github.com/GillianPerard/typescript-json-serializer/commit/a9e2a7445491ac2653be068706425c1a47a1811b)) (special thanks to [@jiripudil](https://github.com/jiripudil))

<a name="1.4.3"></a>
# 1.4.3 (2020-01-30)

### Bug Fixes

* **convertPropertyToData:** manage undefined property ([#53](https://github.com/GillianPerard/typescript-json-serializer/issues/53)) ([f31bf2f](https://github.com/GillianPerard/typescript-json-serializer/commit/f31bf2f7b3a59c56ecdc802cf36b9c428c481327)) (special thanks to [@fullc0de](https://github.com/fullc0de))

<a name="1.4.2"></a>
# 1.4.2 (2019-11-19)

### Bug Fixes

* **convertPropertyToData:** test if a date is undefined or null before using toISOString method ([#50](https://github.com/GillianPerard/typescript-json-serializer/issues/50)) ([8d5d9cf](https://github.com/GillianPerard/typescript-json-serializer/commit/8d5d9cf56f55d508fcac9e769fb5ed20beca7c2a))
* **deserialize:** set first parameter type to object to avoid runtime error ([1ae3531](https://github.com/GillianPerard/typescript-json-serializer/commit/1ae353191d6828129fc83f5065fb8a78cdf9304a))
* **security:** update set-value ([7d07007](https://github.com/GillianPerard/typescript-json-serializer/commit/7d0700732b1f0065af4b3a97fa079cf70ebb0816))

<a name="1.4.1"></a>
# 1.4.1 (2019-11-17)

### Bug fixes

* **docs:** remove useless generics for deserialize function ([#45](https://github.com/GillianPerard/typescript-json-serializer/issues/45)) ([4c76893](https://github.com/GillianPerard/typescript-json-serializer/commit/4c768939ee8ee83543408b2683d90cc270bcc454))

<a name="1.4.0"></a>
# 1.4.0 (2019-11-16)

### Features

* **JsonProperty:** add onDeserialize and OnSerialize options ([#45](https://github.com/GillianPerard/typescript-json-serializer/issues/45)) ([d527290](https://github.com/GillianPerard/typescript-json-serializer/commit/d52729001215f5c7dc1ff2b128b2c888912baa6f))

<a name="1.3.0"></a>
# 1.3.0 (2019-07-20)

### Features

* **deserialize:** add generic type ([a0689eb](https://github.com/GillianPerard/typescript-json-serializer/commit/a0689eb6ff9f5b84ac44a1867c4e6214e7a76104))

<a name="1.2.5"></a>
# 1.2.5 (2019-07-02)

### Bug Fixes

* **getParamNames:** retrieve constructor param names from minified code ([#36](https://github.com/GillianPerard/typescript-json-serializer/issues/36)) ([14f2140](https://github.com/GillianPerard/typescript-json-serializer/commit/14f2140aa1c9a2c762b309bc5c90f6a6232c2338)) (special thanks to [@civilizeddev](https://github.com/civilizeddev))


<a name="1.2.4"></a>
# 1.2.4 (2019-06-21)

### Bug Fixes

* **getParamNames:** exclude comments from constructor parsing ([#33](https://github.com/GillianPerard/typescript-json-serializer/issues/33)) ([77a80c3](https://github.com/GillianPerard/typescript-json-serializer/commit/77a80c3a2fc8a5e8b4615718517313c2e4bdf95f)) ([7231455](https://github.com/GillianPerard/typescript-json-serializer/commit/7231455dd622410de973692b5d544cb4cbfd5870)) (special thanks to [@civilizeddev](https://github.com/civilizeddev))

<a name="1.2.3"></a>
# 1.2.3 (2019-06-20)

### Bug Fixes

* **getParamNames:** exclude simple comments from constructor parsing ([#33](https://github.com/GillianPerard/typescript-json-serializer/issues/33)) ([ad85984](https://github.com/GillianPerard/typescript-json-serializer/commit/ad85984065e6839d6093a5635ec9ba70587e3e7a)) (special thanks to [@civilizeddev](https://github.com/civilizeddev))

<a name="1.2.2"></a>
# 1.2.2 (2019-06-19)

* **getParamNames:** get constructor properties ([e4ba74f](https://github.com/GillianPerard/typescript-json-serializer/commit/e4ba74ff1b512c5cb8bc75db2f20f0821ce64ace))

<a name="1.2.0"></a>
# 1.2.0 (2019-06-14)

### Features

* **JsonProperty:** add support for using it directly inside constructor ([#28](https://github.com/GillianPerard/typescript-json-serializer/issues/28)) ([fe3d92d](https://github.com/GillianPerard/typescript-json-serializer/commit/fe3d92d8499ac3483ff81ef1a45bfa5a3ca4f4ea))

<a name="1.1.0"></a>
# 1.1.0 (2019-04-21)

### Features

* **JsonProperty:** add predicate option ([#19](https://github.com/GillianPerard/typescript-json-serializer/issues/19)) ([4a67bc0](https://github.com/GillianPerard/typescript-json-serializer/commit/4a67bc0f69bf27dfb010aabe87bbf665dc20f9de))