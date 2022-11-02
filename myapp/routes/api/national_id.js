const express = require('express');
const fs = require('fs');
const router = express.Router();

let govs = JSON.parse(fs.readFileSync('data/governerate_codes.json'));




router.post('/', (req,res)=>{

    
    const body = req.body;

    // the api first ensures that the body contains the national_id as a parameter
    if(!body.national_id)
    {
        res.status(400).json({msg: 'You should send the national id as a parameter'});
        return;
    }

    const national_id = body.national_id;

    // then we validate the national id
    if(!validate_national_id(national_id))
    {
        res.status(404).json({valid : false});
        return;
    }


    // finally, we extract all info from the national id and send it in a json format
    const gender = extract_gender(national_id);

    const birthdate = extract_birthdate(national_id);

    const place_of_birth = extract_place_of_birth(national_id);

    
    res.status(404).send({
        valid : true,
        gender : gender,
        birthdate : birthdate,
        place_of_birth : place_of_birth
    });





});


function validate_national_id(national_id)
{
    // all national ids are 14 digits
    if(national_id.length != 14)
        return false;
    
    // this regular expressions ensure most of the constraints on the national id, such as the first digit whether it's 2 or 3
    // most of the birthdate constraints are included but it's only the constraints regarding the day itself 1-31, the month 1-12, and the year not all of them together
    // the constraints for the code of the governerate is also included
    const regex = new RegExp('(2|3)[0-9][0-9][0-1][1-9][0-3][1-9](01|02|03|04|11|12|13|14|15|16|17|18|19|21|22|23|24|25|26|27|28|29|31|32|33|34|35|88)[0-9]{5}');
    if(!regex.test(national_id))
        return false;

    // however we need to add one more check on the birthdate to ensure that it does not validate the constraints of the month like having 31/07 or 30/02 and so on
    const birthdate = extract_birthdate(national_id);

    
    return validate_birthdate(birthdate);
}

function validate_birthdate(birthdate)
{
    const d = new Date(Date.UTC(birthdate['year'], birthdate['month']-1, birthdate['day']));
    
    // this ensures that the date created has the same value for year, month, and day which means there is no violation for the nmuber of days in a month
    // it also ensures that the birthdate is before today's date to avoid having birthdates that are in the future
    return d < Date.now() && d.getFullYear() == birthdate['year'] && d.getMonth() == birthdate['month']-1 && d.getDate() == birthdate['day'];
}


function extract_gender(national_id)
{
    // the 13th digit is responsible for the gender
    // if it's an odd number, it's a male and if it's a even it's a female
    const num = parseInt(national_id.charAt(12));

    if(num%2==0)
        return 'female';
    return 'male';
}

function extract_place_of_birth(national_id)
{
    //the 8th and 9th digits represent the governerate code that is stored in a map to the governerate name in the governerate_codes.json
    return govs[national_id.substring(7, 9)];
}

function extract_birthdate(national_id)
{
    //first digit represents the century, if it's a 2 it means 1900 and if it's a 3 it means 2000
    // 2nd and 3rd digits represent the year number
    const year = (parseInt(national_id.charAt(0)) - 2)*100 + 1900 + parseInt(national_id.substring(1,3));

    // 4th and 5th are the month
    const month = parseInt(national_id.substring(3,5));
    // 6th and 7th are the day
    const day = parseInt(national_id.substring(5,7));

    return {'year':year, 'month':month, 'day':day};
}

module.exports = router;