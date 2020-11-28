//nav.js
const app = getApp();
Page({
    data: {
        logs: [],
        recommend: [
            {
                id: 1,
                face: 'http://p4-q.mafengwo.net/s14/M00/A1/BE/wKgE2l02bHeAWmSoAAEpU6O3pK841.jpeg?imageMogr2%2Fthumbnail%2F%21440x260r%2Fgravity%2FCenter%2Fcrop%2F%21440x260%2Fquality%2F100',
                name: '老君山',
                address: '洛阳的栾川县县城',
                info: '老君山（The Laojun Mountain），原名景室山，位于十三朝古都洛阳的栾川县县城东南三千米处，八百里伏牛山脉的主峰，海拔2297米。是国家AAAAA级旅游景区'
            },
            {
                id: 1,
                face: "http://p3-q.mafengwo.net/s10/M00/76/9A/wKgBZ1kStveAWvByAAGc8PMKFTo88.jpeg?imageMogr2%2Fthumbnail%2F%21440x260r%2Fgravity%2FCenter%2Fcrop%2F%21440x260%2Fquality%2F100",
                name: '西峡老界岭',
                address: '河南省南阳市西峡县',
                info: '西峡老界岭风景区位于中国旅游百强县、全国旅游示范县河南省南阳市西峡县，南阳伏牛山世界地质公园标志景区，老界岭为伏牛山主峰，东西走向四百余里，东端到达内乡宝天曼，西端...'
            },
            {
                id: 1,
                name: '宝天曼',
                face: "http://p1-q.mafengwo.net/s11/M00/92/9C/wKgBEFsEMICAGL7uAAFOuZsct2o72.jpeg?imageMogr2%2Fthumbnail%2F%21400x300r%2Fgravity%2FCenter%2Fcrop%2F%21400x300%2Fquality%2F100",
                address: '河南省南阳市内乡县',
                info: '宝天曼生态旅游区，位于河南省南阳市内乡县北部，宝天曼以她美丽的风景和原始森林为主，空气负氧离子含量12000个每立方厘米，是休闲度假的好地方'
            },
            {
                id: 1,
                name: '五道幢',
                face: "http://n3-q.mafengwo.net/s14/M00/6F/B2/wKgE2l0epEKAXgjWAAbSxjY_NlA023.png?imageMogr2%2Fthumbnail%2F%21440x260r%2Fgravity%2FCenter%2Fcrop%2F%21440x260%2Fquality%2F100",
                address: "南阳伏牛山世界地质公园",
                info: '五道幢生态游览区，南阳伏牛山世界地质公园的核心地带，位于中国优秀旅游城市河南省南阳市的西峡县城东北部二郎坪乡境内，距县城46公里，紧靠311国道和豫51省道'
            }, {
                id: 1,
                face: 'http://n2-q.mafengwo.net/s12/M00/82/61/wKgED1wxi0KAS2gPAABVPUGc5qM80.jpeg?imageMogr2%2Fthumbnail%2F%21440x260r%2Fgravity%2FCenter%2Fcrop%2F%21440x260%2Fquality%2F100',
                name: '西峡恐龙遗迹园',
                address: '南阳市西峡县丹水镇',
                info: '西峡恐龙遗迹园位于中国旅游百强县、全国旅游示范县，河南省南阳市西峡县，是南阳伏牛山世界地质公园核心景区，被誉为“世界第九大奇迹”。中国西峡恐龙遗迹园以西峡恐龙蛋化石',
            }],
        hot: [{
            id: 1,
            face: "http://n1-q.mafengwo.net/s12/M00/36/C8/wKgED1uzQBWAK7QjAGvSz3jr2BY92.jpeg?imageMogr2%2Fthumbnail%2F%21310x414r%2Fgravity%2FCenter%2Fcrop%2F%21310x414%2Fquality%2F90%7Cwatermark%2F1%2Fimage%2FaHR0cDovL2IxLXEubWFmZW5nd28ubmV0L3MxMS9NMDAvNDQvOUIvd0tnQkVGc1A1UnlBRHY3cEFBQUhaWlVQUmxROTkwLnBuZw%3D%3D%2Fgravity%2FSouthEast%2Fdx%2F10%2Fdy%2F11",
            name: '西峡龙潭沟',
            address: '伏牛山腹地的西峡县',
            info: '融山秀、石奇、水澈、林茂、潭幽于一体，被誉为“中原一绝，人间仙境”'
        },{
            id: 2,
            face: 'http://b1-q.mafengwo.net/s11/M00/E1/37/wKgBEFs93fmAYuVBAAFqQU5-R0s08.jpeg?imageMogr2%2Fthumbnail%2F%21690x450r%2Fgravity%2FCenter%2Fcrop%2F%21690x450%2Fquality%2F90%7Cwatermark%2F1%2Fimage%2FaHR0cDovL2IxLXEubWFmZW5nd28ubmV0L3MxMS9NMDAvNDQvOUIvd0tnQkVGc1A1UnlBRHY3cEFBQUhaWlVQUmxROTkwLnBuZw%3D%3D%2Fgravity%2FSouthEast%2Fdx%2F10%2Fdy%2F11',
            name: '丹江大观苑',
            address: '丹江水库北岸',
            info:'举世瞩目的南水北调中线工程水源地――丹江水库北岸，是河南省黄金旅游带“南水北调中线沿线生态观光带”的源头',
        },{
            id: 3,
            face: 'http://n1-q.mafengwo.net/s10/M00/B5/38/wKgBZ1l8CvKADiqQAAovkfscoiQ81.jpeg?imageMogr2%2Fthumbnail%2F%21690x450r%2Fgravity%2FCenter%2Fcrop%2F%21690x450%2Fquality%2F90%7Cwatermark%2F1%2Fimage%2FaHR0cDovL2IxLXEubWFmZW5nd28ubmV0L3MxMS9NMDAvNDQvOUIvd0tnQkVGc1A1UnlBRHY3cEFBQUhaWlVQUmxROTkwLnBuZw%3D%3D%2Fgravity%2FSouthEast%2Fdx%2F10%2Fdy%2F11',
            name: '七星潭',
            address: '内乡县宝天曼南麓',
            info: '七星潭景区位于内乡县宝天曼南麓。属于世界生物圈保护区、国家地质公园宝天曼的重要组成部分，是宝天曼的一颗明珠。'
        },{
            id: 4,
            face: 'http://b1-q.mafengwo.net/s12/M00/C7/68/wKgED1vOrIaAWKBYACfQheqE1FM22.jpeg?imageMogr2%2Fthumbnail%2F%21690x450r%2Fgravity%2FCenter%2Fcrop%2F%21690x450%2Fquality%2F90%7Cwatermark%2F1%2Fimage%2FaHR0cDovL2IxLXEubWFmZW5nd28ubmV0L3MxMS9NMDAvNDQvOUIvd0tnQkVGc1A1UnlBRHY3cEFBQUhaWlVQUmxROTkwLnBuZw%3D%3D%2Fgravity%2FSouthEast%2Fdx%2F10%2Fdy%2F11',
            name: '南阳武侯祠',
            address: '卧龙岗',
            info: '七星潭景区位于内乡县宝天曼南麓。属于世界生物圈保护区、国家地质公园宝天曼的重要组成部分...'
        },{
            id: 5,
            face: 'http://b1-q.mafengwo.net/s13/M00/15/B4/wKgEaV2beueAMPl7AAHJ-8xhC7s90.jpeg?imageMogr2%2Fthumbnail%2F%21310x310r%2Fgravity%2FCenter%2Fcrop%2F%21310x310%2Fquality%2F90%7Cwatermark%2F1%2Fimage%2FaHR0cDovL2IxLXEubWFmZW5nd28ubmV0L3MxMS9NMDAvNDQvOUIvd0tnQkVGc1A1UnlBRHY3cEFBQUhaWlVQUmxROTkwLnBuZw%3D%3D%2Fgravity%2FSouthEast%2Fdx%2F10%2Fdy%2F11',
            name: '七十二潭',
            address: '南阳市方城县',
            info:'景区的代表性景观是石川地貌'
        },{
            id: 5,
            face: 'http://p1-q.mafengwo.net/s5/M00/2F/4B/wKgB3FFtBGyAAkWSAAPDJC_3T6U02.jpeg?imageMogr2%2Fthumbnail%2F%21690x370r%2Fgravity%2FCenter%2Fcrop%2F%21690x370%2Fquality%2F100',
            name: '五道幢',
            address: '西峡县二郎坪镇',
            info:'五道幢生态游览区位于西峡县城东北部的二郎坪乡境内，距县城46公里，紧靠311国道和豫51省道。'
        },
        ],
        list: [1, 2, 4, 5, 6, 6, 7, 8]
    },
    HandleClick(){
        app.ShowToast('研发中，敬请期待～')
    },
    onLoad: function () {
    }
})
