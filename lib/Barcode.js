'use strict';

var React = require('react');
var PropTypes = require('prop-types');
var createReactClass = require('create-react-class');
var {View} = require('react-native');
var Canvas = require('./Canvas.js');
var {encodeData, formats} = require('./barcodes/UPC');

function renderCanvas(canvas) {
    var heightOffset = 0.694;
    var ctx = canvas.getContext('2d');
    var size = this.size;
    var fgColor = this.fgColor;
    var bgColor = this.bgColor;
    canvas.width = size;
    canvas.height = size * heightOffset;
    canvas.style.left = (window.innerWidth - size) / 2 + 'px';
    if(window.innerHeight > size) canvas.style.top = (window.innerHeight - size) / 2 + 'px';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    var data = this.data;
    var barWidth = size / data.length;
    var barHeight = canvas.height;
    data.forEach(function(bar, index) {
        var nLeft = index * barWidth;
        ctx.fillStyle = bar === 1 ? fgColor : bgColor;
        ctx.fillRect(nLeft, 0, barWidth, barHeight);
    });
}

var Barcode = createReactClass({
    PropTypes: {
        value: PropTypes.string,
        format: PropTypes.string,
        width: PropTypes.number,
        bgColor: PropTypes.string,
        fgColor: PropTypes.string,
        onLoad: PropTypes.func,
        onLoadEnd: PropTypes.func,
    },

    getDefaultProps: function() {
        return {
            value: '012345678905',
            bgColor: '#FFFFFF',
            fgColor: '#000000',
            format: formats.UPC_A,
            width: 250,
            onLoad: () => {},
            onLoadEnd: () => {},
        }
    },

    render: function() {
        var heightOffset = 0.694;
        var size = this.props.width >= 250 ? this.props.width : 250;
        var value = this.props.value;
        var format = this.props.format;
        var encodedValue = encodeData(value, format);

        return (
            <View>
                <Canvas
                    context={{
                    size: size,
                        value: value,
                        bgColor: this.props.bgColor,
                        fgColor: this.props.fgColor,
                        data: encodedValue
                }}
                    render={renderCanvas}
                    onLoad={this.props.onLoad}
                    onLoadEnd={this.props.onLoadEnd}
                    style={{
                        height: (size * heightOffset) - 1,
                            width: size
                    }}
                />
            </View>
        );
    }
});

module.exports = {
    Barcode: Barcode,
    Formats: formats
};
