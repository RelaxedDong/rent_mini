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
        select2: '',
        leftIndex: 0,
        selectedQt: 0,
        selectedSq: 0,
        selectedSort: 1,
        // slider

    },
    methods: {
        // 这里是自定义方法
        listqy: function (e) {
            if (this.data.hyopen) {
                this.setData({
                    hyopen: false,
                    sqopen: false,
                    pxopen: false,
                    sortopen: false,
                    shownavindex: 0
                })
            } else {
                this.setData({
                    hyopen: true,
                    pxopen: false,
                    sqopen: false,
                    sortopen: false,
                    shownavindex: e.currentTarget.dataset.nav
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
                    shownavindex: e.currentTarget.dataset.nav
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
                    shownavindex: e.currentTarget.dataset.nav
                })
            }
            console.log(e.target)
        },
        listsort: function (e) {
            if (this.data.sortopen) {
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
                    pxopen: false,
                    hyopen: false,
                    sortopen: true,
                    shownavindex: e.currentTarget.dataset.nav
                })
            }
        },
        selectleft: function (e) {
            var model = e.currentTarget.dataset.model.components;
            var value = e.target.dataset.model.value
            var selectedTitle = e.target.dataset.model.title;
            this.setData({
                dropDownMenuDataFirstRight: model == null ? "" : model,
                select1: value,
                leftIndex: e.currentTarget.dataset.leftIndex,
                select2: '',
            })
            if (model == null || model.length == 0) {
                this.closeHyFilter();
                this.triggerEvent("selectedItem", {
                    index: this.data.shownavindex,
                    selectedId: value,
                    selectedTitle: selectedTitle
                })
            }
        },
        selectcenter: function (e) {
            var selectedId = e.target.dataset.model.id
            var selectedTitle = e.target.dataset.model.title;
            this.closeHyFilter();
            this.setData({
                select2: selectedId
            })
            this.triggerEvent("selectedItem", {
                index: this.data.shownavindex,
                selectedId: selectedId,
                selectedTitle: selectedTitle
            })
        },
        selectsqitem: function (e) {
            var selectedId = e.target.dataset.model.id
            var selectedTitle = e.target.dataset.model.title;
            this.closeHyFilter();
            this.setData({
                selectedSq: selectedId
            })
            this.triggerEvent("selectedItem", {
                index: this.data.shownavindex,
                selectedId: selectedId,
                selectedTitle: selectedTitle
            })
        },
        selecsortlitem: function (e) {
            var selectedId = e.target.dataset.model.id
            var selectedTitle = e.target.dataset.model.title;
            this.closeHyFilter();
            this.setData({
                selectedSort: selectedId
            })
            this.triggerEvent("selectedItem", {
                index: this.data.shownavindex,
                selectedId: selectedId,
                selectedTitle: selectedTitle
            })
        },
        selecqtlitem: function (e) {
            var selectedId = e.target.dataset.model.id
            var selectedTitle = e.target.dataset.model.title;
            this.closeHyFilter();
            this.setData({
                selectedQt: selectedId
            })
            this.triggerEvent("selectedItem", {
                index: this.data.shownavindex,
                selectedId: selectedId,
                selectedTitle: selectedTitle
            })
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
        /**关闭筛选 */
        closeHyFilter: function () {
            if (this.data.hyopen) {
                this.setData({
                    hyopen: false,
                    sqopen: false,
                    pxopen: false,
                    sortopen: false,
                })
            } else if (this.data.sqopen) {
                this.setData({
                    sqopen: false,
                    pxopen: false,
                    hyopen: false,
                    sortopen: false,
                })
            } else if (this.data.pxopen) {
                this.setData({
                    sqopen: false,
                    pxopen: false,
                    hyopen: false,
                    sortopen: false,
                })
            } else if (this.data.sortopen) {
                this.setData({
                    sqopen: false,
                    pxopen: false,
                    hyopen: false,
                    sortopen: false,
                })
            }
        },
    },
    //组件生命周期函数，在组件实例进入页面节点树时执行
    attached: function () {
        // 可以在这里发起网络请求获取插件的数据

    },
})