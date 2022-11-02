const express = require('express');
const fs = require('fs');
const router = express.Router();

let govs = JSON.parse(fs.readFileSync('data/governerate_codes.json'));




router.post('/', (req,res)=>{

    
    const body = req.body;
    if(!body.national_id)
    {
        res.status(400).json({msg: 'You should send the national id as a parameter'});
        return;
    }

    const national_id = body.national_id;

    if(!validate_national_id(national_id))
    {
        res.status(404).json({valid : false});
        return;
    }


    const gender = extract_gender(national_id);

    const birthdate = extract_birthdate(national_id);

    const governerate = extract_governerate(national_id);

    
    res.status(404).send({
        valid : true,
        gender : gender,
        birthdate : birthdate,
        governerate : governerate
    });





});


function validate_national_id(national_id)
{
    
    const regex = new RegExp('(2|3)[0-9][0-9][0-1][1-9][0-3][1-9](01|02|03|04|11|12|13|14|15|16|17|18|19|21|22|23|24|25|26|27|28|29|31|32|33|34|35|88)[0-9]{5}');
    if(!regex.test(national_id))
        return false;

    const birthdate = extract_birthdate(national_id);

    
    return validate_birthdate(birthdate);
}

function validate_birthdate(birthdate)
{
    const d = new Date(Date.UTC(birthdate['year'], birthdate['month']-1, birthdate['day']));
    

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

function extract_governerate(national_id)
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