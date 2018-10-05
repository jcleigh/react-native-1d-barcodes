# react-native-1d-barcodes
[![Download](https://img.shields.io/badge/Download-0.1.2-brightgreen.svg) ](https://www.npmjs.com/package/react-native-1d-barcodes)
[![react-native-1d-barcodes releases](https://img.shields.io/badge/Release-0.1.2-blue.svg) ](https://www.github.com/jcleigh/react-native-1d-barcodes/releases)

A React Native component to generate one-dimensional (1D) barcodes.

#### Supported 1D barcode types:
- [x] UPC-A
- [ ] UPC-E _(in progress)_
- _additional types will be added in future minor versions_

## Installation
```sh
npm i react-native-1d-barcodes --save
 # or
yarn add react-native-1d-barcodes
```

```jsx
import React, { Component } from 'react'
import { View } from 'react-native';
import { Barcode, Formats } from 'react-native-1d-barcodes';

export default class DisplayBarcode extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Barcode
            bgColor={'#FFFFFF'}
            fgColor={'#000000'}
            format={Formats.UPC_A}
            value={'01234567890'}
            width={250}
        />
      </View>
    );
  }
}
```

## Usage

##### UPC-A
- Provide an 11-digit numeric string as `value` and the module will calculate the
check digit and render the UPC barcode in a WebView canvas.
- Module will accept 12-digit strings if your data already includes a valid check digit.
_(Note: check digit is not validated in this instance)_

##### Available Props:
prop      | type                 | default value
----------|----------------------|--------------
`value`   | `string` (numeric)   | `012345678905`
`format`  | `string`             | `Formats.UPC_A`
`width`   | `number`             | `250`
`bgColor` | `string` (CSS color) | `"#FFFFFF"`
`fgColor` | `string` (CSS color) | `"#000000"`

_Note: `height` is calculated based on provided `width`._

## References
- https://www.gs1.org/standards/barcodes/ean-upc
- https://en.wikipedia.org/wiki/Universal_Product_Code#Encoding
- https://www.gtin.info/upc/
- https://github.com/cssivision/react-native-qrcode
