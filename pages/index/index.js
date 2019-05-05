Page({
    data: {
        schemas: [{
                name: '颜色',
                values: [{
                        id: 0,
                        enable: 1,
                        name: '红色'
                    },
                    {
                        id: 1,
                        enable: 1,
                        name: '黄色'
                    },
                    {
                        id: 2,
                        enable: 1,
                        name: '绿色'
                    },
                    {
                        id: 3,
                        enable: 0,
                        name: '蓝色'
                    },
                ]
            },
            {
                name: '尺码',
                values: [{
                        id: 0,
                        enable: 1,
                        name: 'S'
                    },
                    {
                        id: 1,
                        enable: 1,
                        name: 'M'
                    },
                    {
                        id: 2,
                        enable: 1,
                        name: 'X'
                    },
                    {
                        id: 3,
                        enable: 0,
                        name: 'XL'
                    },
                ]
            }
        ],

        skus: [{
                id: 1,
                price: 25.03,
                schema: [0, 0],
                stock: 5
            },
            {
                id: 1,
                price: 26.73,
                schema: [0, 1],
                stock: 5
            },
            {
                id: 3,
                price: 28.12,
                schema: [0, 2],
                stock: 5
            },
            {
                id: 4,
                price: 29.49,
                schema: [1, 0],
                stock: 8
            },
            {
                id: 5,
                price: 30.88,
                schema: [1, 2],
                stock: 8
            },
            {
                id: 6,
                price: 37.88,
                schema: [2, 1],
                stock: 8
            }
        ],

        schemaValues: [null, null], // 当前选中的两组 schema 的值

        skuObj: null, // 当前 sku 信息（当两个 schema 都选中时有效）
        priceRange: '', // 价格区间

    },

    chooseSchemaValue(e) {

        let dataset = e.target.dataset;
        if (dataset.schemaDisabled) {
            console.log('禁用态不可点击');
            return;
        }

        this.setData({
            skuObj: null,
            priceRange: '',
        })

        let schemaIndex = dataset.schemaIndex;
        let schemaValue = dataset.schemaValue;


        let oldSchemaValue = this.data.schemaValues[schemaIndex];
        if (oldSchemaValue === null) {
            this.setData({
                [`schemaValues[${schemaIndex}]`]: schemaValue
            });
        } else {
            this.setData({
                [`schemaValues[${schemaIndex}]`]: schemaValue === oldSchemaValue ? null : schemaValue
            });
        }

        // 当前项选中
        let newSchemaValue = this.data.schemaValues[schemaIndex];
        let schemas = this.data.schemas;
        schemas[schemaIndex].values.forEach(item => {
            item.selected = item.id === newSchemaValue ? 1 : 0;
        });
        this.setData({
            schemas: schemas
        });

        if (newSchemaValue !== null) { // 选中了本项

            // 设置另一项的可选和不可选状态
            // 找出另一组 schema 的有效值列表
            let otherSchemaIndex = (schemaIndex + 1) % 2;
            let otherSchemaValidValues = [];
            for (let i = 0; i < this.data.skus.length; i++) {
                let skuItem = this.data.skus[i];
                if (skuItem.schema[schemaIndex] === newSchemaValue) {
                    otherSchemaValidValues.push(skuItem.schema[otherSchemaIndex]);
                }
            }

            let schemas = this.data.schemas;
            schemas[otherSchemaIndex].values.forEach(item => {
                if (otherSchemaValidValues.indexOf(item.id) === -1) {
                    item.tempEnable = 0;
                } else {
                    item.tempEnable = 1;
                }
            });

            this.setData({
                schemas: schemas
            });

            if (this.data.schemaValues.indexOf(null) === -1) { // 另一项也选中，则找出 SKU 展示
                let sku = this.data.skus.find(sku => {
                    return JSON.stringify(sku.schema) === JSON.stringify(this.data.schemaValues);
                });

                if (sku) {
                    this.setData({
                        skuObj: sku
                    })
                }
            } else { // 如果另一项未选中，则计算出价格区间
                let priceArr = [];
                this.data.skus.forEach(sku => {
                    if (sku.schema[schemaIndex] === newSchemaValue) {
                        priceArr.push(sku.price);
                    }
                });

                priceArr.sort((a, b) => a - b);
                if (priceArr[0] === priceArr[priceArr.length - 1]) {
                    this.setData({
                        priceRange: priceArr[0]
                    });
                } else {
                    this.setData({
                        priceRange: priceArr[0] + '~' + priceArr[priceArr.length - 1]
                    });
                }

            }
        } else { // 取消了本项的选择，则开放另一项的 tempEnable
            let otherSchemaIndex = (schemaIndex + 1) % 2;
            let schemas = this.data.schemas;
            schemas[otherSchemaIndex].values.forEach(item => {
                item.tempEnable = 1;
            });

            this.setData({
                schemas: schemas
            });

            if (this.data.schemaValues[otherSchemaIndex] !== null) {  // 如果另一项有选中，则计算价格区间
                let priceArr = [];
                this.data.skus.forEach(sku => {
                    if (sku.schema[otherSchemaIndex] === this.data.schemaValues[otherSchemaIndex]) {
                        priceArr.push(sku.price);
                    }
                });

                priceArr.sort((a, b) => a - b);
                if (priceArr[0] === priceArr[priceArr.length - 1]) {
                    this.setData({
                        priceRange: priceArr[0]
                    });
                } else {
                    this.setData({
                        priceRange: priceArr[0] + '~' + priceArr[priceArr.length - 1]
                    });
                }
            }
        }

    },


    onLoad() {

    }
})