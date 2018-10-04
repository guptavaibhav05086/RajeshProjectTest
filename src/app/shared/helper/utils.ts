export class Utils {
    public static filter(list, field, value, isObject) {
        let newList = [];

        for(let i = 0; i < list.length; i++) {
            if (isObject) {
                if (list[i][field] && list[i][field]._id == value) {
                    newList.push(list[i])
                }
            } else {
                if (list[i][field] == value) {
                    newList.push(list[i])
                }
            }
        }

        return newList;
    }

    public static getElementIndexByFeild(list, field, value) {
        for(let i = 0; i < list.length; i++) {
            if (list[i][field] == value) {
                return i;
            }
        }

        return -1;
    }

    public static formatAmountInINR(input) {
        if (input && !isNaN(input)) {
            var currencySymbol = '₹';
            //var output = Number(input).toLocaleString('en-IN');   <-- This method is not working fine in all browsers!           
            var result = input.toString().split('.');

            var lastThree = result[0].substring(result[0].length - 3);
            var otherNumbers = result[0].substring(0, result[0].length - 3);
            if (otherNumbers != '')
                lastThree = ',' + lastThree;
            var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
            
            if (result.length > 1) {
                output += "." + result[1];
            } else {
                output += ".00";
            }       

            return output;
            //return currencySymbol + output;
        }
    }
}