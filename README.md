# shahry_task

### 1) How to run the application

1) Clone the repository to your local machine
2) open the folder on terminal and write
```
cd myapp
npm install
npm start
```
3) To test the api send a post call to localhost:3000/api/national_id with national_id passed in the body.


### 2) API Design Choice

* path: POST localhost:3000/api/national_id

* I had two choices to make the API as either a GET api where I the national id can be passed within the path of the api but this could cause security issues.
That's why I chose to make it a POST api where the national id is passed as a parameter in the body of the api call.

* Inputs:
```
body:{
'national_id': '29001011234567'
}
```
* Outputs: the api returns a json file that can have one key or more according to the input
1) if the national id is not valid, the json has one field called valid with value equal to false
```
{
  'valid' : false
}
```

2) On the contrary, if the national id is valid, the json contains a valid field as well with true value, along with some extracted information from it that includes the gender, birthdate, and place of birth as follows:
```
{
  'valid' : true,
  'gender : 'female',
  'birthdate':{
                'year' : 1990,
                 'month' : 1,
                 'day' : 1
              },
'place_of_birth' : 'Dakahleya'              
}
```

### 3) API logic

1) National id validation:
* The first check is the length of the national id that should be 14
* Secondly, the string is matched with a regular expression to validate some important fields like the birthdate and governerate code
* Finally, we add one more check for the birthdate to ensure that it does not violate the number of days in a month constraint and it's not a date in the future.

2) Gender extraction:
The gender is represented by the 13th digit in the national id. If it's an odd digit, this means this person is a male. Otherwise, the person is a female

3) birthdate
* The first digit represents which century this person was born in. If it's a 2, it means they were born in the 1900s. If it's a 3, they were born in the 2000s
* 2nd and 3rd digits represent the year
* 4th and 5th represent the month
* 6th and 7th represent the day

4) Place of birth
8th and 9th represent a code for the place of birth according the following map:
```
{
    "01" : "Cairo",
    "02" : "Alexandria",
    "03" : "Port Said",
    "04" : "Suez",
    "11" : "Damietta",
    "12" : "Dakahleya",
    "13" : "Sharkia",
    "14" : "Qalyubia",
    "15" : "Kafr El-Sheikh",
    "16" : "Gharbia",
    "17" : "Monoufiya",
    "18" : "Beheira",
    "19" : "Ismailia",
    "21" : "Giza",
    "22" : "Beni-suef",
    "23" : "Fayoum",
    "24" : "Minya",
    "25" : "Assiyut",
    "26" : "Souhag",
    "27" : "Qena",
    "28" : "Aswan",
    "29" : "Luxour",
    "31" : "Red Sea",
    "32" : "New Valley",
    "33" : "Matrouh",
    "34" : "North Sinai",
    "35" : "South Sinai",
    "88" : "Outside Egypt"
}
```

