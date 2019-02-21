'use strict';

const sinon = require('sinon');
const { assert } = require('chai');

const s3mv = require('../index.js');

describe('LambdaS3Mv', () => {

    describe('#move()', () => {

        beforeEach(() => {
            this.callback = sinon.fake();
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should throw error if one of the required parameters is missing', () => {
            // GIVEN
            const options = {
                sourceBucket: 's3-source-bucket-name',
                sourcePath: 's3-source-prefix-path',
                targetPath: ''
            };

            // WHEN
            s3mv.move(options).then(() => {
                assert.fail();
            }).catch(error => {
                // THEN
                assert.isDefined(error);
            });
        });

    });

});