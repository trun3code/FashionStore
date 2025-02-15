/* eslint-disable no-unused-vars */
/* eslint-disable no-redeclare */
import { getAllOrders } from "./order";
import { getProduct } from "./product";
import { getFullUser } from "./user";

var orders = [];
var users = [];
var start = null;
var end = null;
var cur = new Date();
cur.setHours(0, 0, 0, 0);

const checkTime = (time) => {
    if (!start) return true;
    var curTime = new Date(time);
    return curTime >= start && (!end || curTime <= end);
}
const getOverviewData = () => {
    const data = {};
    data.totalPrice = 0;
    data.totalUser = 0;
    data.totalOrder = 0;
    data.totalProduct = 0;
    for (var i in orders) {
        if (orders[i]?.status != 'delivered') continue;
        if (!checkTime(orders[i].updateAt)) continue;
        data.totalPrice += orders[i].total;
        data.totalOrder += 1;
        for (var j = 0; j < orders[i].items.length; j++) {
            data.totalProduct += orders[i].items[j].amount;
        }
    }
    for (var i in users)
        if (checkTime(users[i].createAt)) data.totalUser++;
    return data;
}
const getTopProduct = async () => {
    var arr = {};
    for (var i = 0; i < orders.length; i++) {
        if (orders[i].status != "delivered") continue;
        const date = new Date(orders[i].updateAt);
        if (checkTime(date)) {
            for (var j = 0; j < orders[i].items.length; j++) {
                var item = orders[i].items[j].item;
                if (item?.product != null) {
                    arr[item.product.id] ??= 0;
                    arr[item.product.id] += orders[i].items[j].amount;
                }
            }
        }
    }
    arr = Object.entries(arr).sort((a, b) => b[1] - a[1]).slice(0, 4);
    const rs = [];
    for (var i = 0; i < arr.length; i++) {
        const product=await getProduct(arr[i][0]);
        rs.push({
            "productName":product.productName,
            "productImage":product.productImage,
            "amount":arr[i][1]
        })
    }
    return rs;
}
const getUserCity = () => {
    const rs = [0, 0];
    for (var i = 0; i < orders.length; i++) {
        if (orders[i].status != "delivered") continue;
        const date = new Date(orders[i].updateAt);
        if (checkTime(date)) {
            if (orders[i].shippingAddress.city === "Thành phố Hà Nội")
                rs[0]++;
            else rs[1]++;
        }
    }
    return rs;
}
const getWeeklySale = () => {
    const rs = []
    for (let i = 0; i < orders.length; i++) {
        const o = orders[i];
        if (!o.updateAt || o.status != "delivered") continue;
        const day = new Date(o.updateAt);
        day.setHours(0, 0, 0, 0);
        const delta = cur.getTime() - day.getTime();
        // if(day==cur.getTime()-1)
        //     console.log(day,cur);
        //
    }
    return rs;
}
const getMonthlyGoal = () => {
    return 75;
}
const getHotCategory = () => {
    const rs = {}
    for (let i = 0; i < orders.length; i++) {
        const o = orders[i];
        if (o.updateAt && o.status === "delivered") {
            const day = new Date(o.updateAt);
            if (!rs[day.getFullYear()])
                rs[day.getFullYear()] = [];
            if (!rs[day.getFullYear()][day.getMonth()])
                rs[day.getFullYear()][day.getMonth()] = {};
            for (let j = 0; j < o.items.length; j++) {
                const p = o.items[j];
                if (!p?.product) continue;
                if (!rs[day.getFullYear()][day.getMonth()][p.item.product.categories[1].name])
                    rs[day.getFullYear()][day.getMonth()][p.item.product.categories[1].name] = p.amount;
                else rs[day.getFullYear()][day.getMonth()][p.item.product.categories[1].name] += p.amount;
            }
        }
    }
    const data = {}
    for (var p in rs) {
        data[p] = {};
        const shoesData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        const clothesData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        const accessoriesData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (var i = 0; i < rs[p].length; i++) {
            const e = rs[p][i];
            if (e) {
                shoesData[i] += e.shoes ? e.shoes : 0;
                clothesData[i] = e.clothes ? e.clothes : 0;
                accessoriesData[i] = e.accessories ? e.accessories : 0;
            }
        }
        data[p].shoesData = shoesData;
        data[p].clothesData = clothesData;
        data[p].accessoriesData = accessoriesData;
    }
    return data;
}
export const getDashboardData = async (startDate, endDate) => {
    orders = await getAllOrders();
    users = await getFullUser();
    if (startDate)
        start = new Date(startDate);
    else start = null;
    if (endDate) {
        end = new Date(endDate);
        end.setHours(23, 59, 59);
    }
    else end = null;
    const data = {};
    data.overview = getOverviewData();
    data.topProducts =await getTopProduct();
    data.userCity = getUserCity();
    // data.weeklySale = getWeeklySale();
    // data.hotCategory = getHotCategory();
    // data.monthlyGoal = getMonthlyGoal();
    return data;
}