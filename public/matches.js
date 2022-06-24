var occ_count = 1;
var percentage = [];
var males = [];
var females = [];

function cal_occ(string1, string2) {
    var arr_matches = (string1.toLowerCase() + "matches" + string2.toLowerCase()).split("");

    var nom_of_occ = [];

    for (var i = 0; i < arr_matches.length; i++) {
        for (var k = i + 1; k < arr_matches.length; k++) {

            if (arr_matches[i] == arr_matches[k]) {
                // console.log("k - " + arr_matches[k] + " - i " + arr_matches[i]);

                occ_count++;
                arr_matches.splice(k, 1);
            }

        }
        nom_of_occ.push(occ_count);
        occ_count = 1;
    }

    return nom_of_occ;

}


/* console.log(nom_of_occ);
console.log(nom_of_occ.length); */


function cal_percentage(nom_of_occ, name1, name2) {
    for (var i = 0; i < nom_of_occ.length; i++) {

        if (nom_of_occ.length > 2) {
            nom_of_occ = calSum(nom_of_occ);
        }


        if (nom_of_occ.length == 2) {
            // console.log([i, nom_of_occ.length]);
            if (i == 2)
                i = 0

            nom_of_occ = nom_of_occ.join("").split("").map(Number);

            /* console.log(nom_of_occ) */

        }

        // console.log(nom_of_occ);



    }

    var match_per = parseInt(nom_of_occ.join(""));
    var res_string = "";

    // console.log(match_per);

    if (match_per >= 80) {
        res_string = ", good match";
    }

    percentage.push([cap_string(name1) + " matches " + cap_string(name2) + " " + match_per + "%" + res_string, match_per]);

    return cap_string(name1) + " matches " + cap_string(name2) + " " + match_per + "%" + res_string;


}


function cap_string(myString) {

    return myString.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
}




function calSum(arr_match) {
    var new_arr = [];
    for (var j = 0; j < Math.floor(arr_match.length / 2); j++) {
        new_arr.push(arr_match[j] + arr_match[arr_match.length - j - 1]);
    }
    add_mid_val(arr_match, new_arr);
    return new_arr;
}


function add_mid_val(arr_match, new_arr) {
    if (arr_match.length % 2 != 0) {
        //odd number
        new_arr.push(arr_match[Math.floor(arr_match.length / 2)]);

    }
}



function populateEntries(arr) {
    for (let i = 0; i < arr.length; i++) {
        var entry = arr[i].split(",");
        console.log(entry[1]);
        if (isEmpty(entry[1])) {
            alert("Unexpected file structure");
            return;
        }
        else if (entry[1].trim() != "m" && entry[1].trim() != "f") {
            alert("Unexpected file structure");
            return;
        }
        ((entry[1].trim() == "m") ? males.push(entry[0]) : females.push(entry[0]))
    }

    // console.log([males, females]);
}

function removeDuplicates(arr) {

    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] == arr[j]) {
                arr.splice(j, 1);
            }
        }
    }
    return arr;
}

function matchEntries() {
    for (let i = 0; i < males.length; i++) {
        for (let j = 0; j < females.length; j++) {
            var results = cal_percentage(cal_occ(males[i], females[j]), males[i], females[j]);

            console.log(results);
        }
    }

    orderMax();
}


function orderMax() {
    // console.log(percentage);
    var data = [];
    var res_data = selectionSort(percentage);

    //extract send data
    for (let i = 0; i < res_data.length; i++) {
        data.push(res_data[i][0]);
    }

    // console.log(JSON.parse(data));
    //send return data to node;
    if (data.length != 0) {
        fetch('/writeFile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }

}

function selectionSort(inputArr) {
    let n = inputArr.length;

    for (let i = 0; i < n; i++) {
        // Finding the smallest number in the subarray
        let max = i;
        for (let j = i + 1; j < n; j++) {
            if (inputArr[j][1] > inputArr[max][1]) {
                max = j;
            }
            else if (inputArr[j][1] == inputArr[max][1]) {
                if (inputArr[j][0] < inputArr[max][0]) {
                    max = j;
                }
            }
        }
        if (max != i) {
            // Swapping the elements
            let tmp = inputArr[i];
            inputArr[i] = inputArr[max];
            inputArr[max] = tmp;
        }
    }
    return inputArr;
}

function isEmpty(value) {
    return value == "" || value == " " || value == '' || value == ' ' || value == undefined || value == null || value == "null";
}

