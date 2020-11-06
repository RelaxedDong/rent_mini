//Component() 来注册组件，并提供组件的属性定义、内部数据和自定义方法
Component({
    properties: {
        // 这里定义了innerText属性，属性值可以在组件使用时指定
        dropDownMenuTitle: {
            type: Array,
            value: ['1', '2', '3', '4'],
        },
        dropDownMenuFirstData: {
            type: Array,
            value: []
        },

        dropDownMenuRegion: {
            type: Array,
            value: []
        },
        dropDownMenuThirdData: {
            type: Array,
            value: []
        },
        dropDownMenuFourthData: {
            type: Array,
            value: []
        },
    },
    data: {
        // 这里是一些组件内部数据
        hyopen: false,
        sqopen: false,
        pxopen: false,
        sortopen: false,
        shownavindex: '',
        dropDownMenuDataFirstRight: {},
        select1: '',
        leftIndex: 0,
        selectedQt: 0,
        selectedSq: 0,
        selectedSort: 1,
        // slider
        selectedValue1: "",
        selectedValue2: "",
        selectedValue3: "",
        selectedValue4: "",
        // 筛选器多选
        selectedSubwayList: [],
        // price:
        inputLow: "",
        inputHigh: "",
    },
    methods: {
        // 这里是自定义方法
        PriceInput: function(e){
            let ty = e.currentTarget.dataset.ty;
            if(ty === 'low'){
                this.setData({
                    inputLow: e.detail.value
                })
            } else {
                this.setData({
                    inputHigh: e.detail.value
                })
            }
        },
        CustomPriceClick: function(e){
            this.triggerEvent("selectedItem", {
                index: e.currentTarget.dataset.card,
                selectedValue: this.data.inputLow+ '-' + this.data.inputHigh
            })
            this.setData({
                selectedValue4: "",
            })
        },
        listqy: function (e) {
            if (this.data.hyopen) {
                this.setData({
                    hyopen: false,
                    sqopen: false,
                    pxopen: false,
                    sortopen: false,
                })
            } else {
                this.setData({
                    hyopen: true,
                    pxopen: false,
                    sqopen: false,
                    sortopen: false,
                })
            }

        },
        list: function (e) {
            if (this.data.sqopen) {
                this.setData({
                    sqopen: false,
                    pxopen: false,
                    hyopen: false,
                    sortopen: false,
                    shownavindex: 0
                })
            } else {
                this.setData({
                    sqopen: true,
                    pxopen: false,
                    hyopen: false,
                    sortopen: false,
                })
            }
        },
        listpx: function (e) {
            if (this.data.pxopen) {
                this.setData({
                    sqopen: false,
                    pxopen: false,
                    hyopen: false,
                    sortopen: false,
                    shownavindex: 0
                })
            } else {
                this.setData({
                    sqopen: false,
                    pxopen: true,
                    sortopen: false,
                    hyopen: false,
                })
            }
        },
        listsort: function (e) {
            if (this.data.sortopen) {
                this.setData({
                    sqopen: false,
                    pxopen: false,
                    hyopen: false,
                    sortopen: false,
                })
            } else {
                this.setData({
                    sqopen: false,
                    pxopen: false,
                    hyopen: false,
                    sortopen: true,
                })
            }
        },
        selectleft: function (e) {
            var components = e.currentTarget.dataset.model.components;
            let selectedSubwayList = this.data.selectedSubwayList;
            for(let i =0;i<components.length; i++){
                components[i].is_active = selectedSubwayList.indexOf(components[i].name) > -1;
            }
            var value = e.target.dataset.model.value
            this.setData({
                dropDownMenuDataFirstRight:components,
                select1: value,
                leftIndex: e.currentTarget.dataset.leftIndex,
            })
        },
        selectListItem: function (e) {
            var selectedValue = e.currentTarget.dataset.value
            var key = e.currentTarget.dataset.key
            let setData = {
                [key]: selectedValue
            }
            if(key === 'selectedValue2') {
                if(selectedValue === this.data.selectedValue2){
                    selectedValue = ""
                    setData['selectedValue2'] = ""
                }
                selectedValue = [selectedValue, this.data.selectedSubwayList]
            }
            if(key === 'selectedValue3') {
                let selectedSubwayList = this.data.selectedSubwayList;
                if(selectedSubwayList.indexOf(selectedValue) === -1) {
                   selectedSubwayList.push(selectedValue)
                } else {
                   selectedSubwayList.pop(selectedValue)
                }
                let dropDownMenuDataFirstRight = this.data.dropDownMenuDataFirstRight
                let index = e.currentTarget.dataset.index
                dropDownMenuDataFirstRight[index]['is_active'] = !dropDownMenuDataFirstRight[index].is_active
                setData['selectedSubwayList'] = selectedSubwayList
                setData['dropDownMenuDataFirstRight'] = dropDownMenuDataFirstRight
                selectedValue = [this.data.selectedValue2, selectedSubwayList]
            }
            if(key === 'selectedValue4') {
                if(selectedValue === this.data.selectedValue4){
                    selectedValue = ""
                    setData['selectedValue4'] = ""
                }
                    setData['inputLow'] = ""
                    setData['inputHigh'] = ""
            }
            if(key === 'selectedValues') {
                var board_index = e.currentTarget.dataset.board;
                var index = e.currentTarget.dataset.index;
                var dropDownMenuFourthData = this.data.dropDownMenuFourthData;
                var is_active = dropDownMenuFourthData[board_index].components[index].is_active;
                dropDownMenuFourthData[board_index].components[index].is_active = !is_active;
                var sources = {}
                for(let board_index in dropDownMenuFourthData){
                    sources[board_index] = []
                    for(let i=0;i<dropDownMenuFourthData[board_index].components.length;i++){
                        if(dropDownMenuFourthData[board_index].components[i].is_active){
                            sources[board_index].push(dropDownMenuFourthData[board_index].components[i].value)
                        }
                    }
                }
                selectedValue = sources
                setData['dropDownMenuFourthData'] = dropDownMenuFourthData
            }
            this.triggerEvent("selectedItem", {
                index: e.currentTarget.dataset.card,
                selectedValue: selectedValue,
            })
            this.setData(setData)
        },
        lowValueChangeAction1: function (e) {
            this.setData({
                low1: e.detail.lowValue
            })
        },
        heighValueChangeAction1: function (e) {
            this.setData({
                heigh1: e.detail.heighValue
            })
        },
    },
    //组件生命周期函数，在组件实例进入页面节点树时执行
    attached: function () {
        // 可以在这里发起网络请求获取插件的数据

    },
})