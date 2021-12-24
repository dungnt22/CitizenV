var citizen = require('./models/citizen');


/* Gender ratio */
// NATION
const getRatioGender = (req, res, next) => {
  citizen.aggregate([
    { $project: {
        address_h: { $split: ['$temporaryAddress', ' - ']},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: {
          $divide: [
            {
              $subtract: [
                new Date(), '$dateOfBirth'
              ]
            }, (365 * 24 * 60 * 60 * 1000)
          ]
        }
    }}, 
    { $project: {
        province: {$arrayElemAt: ['$address_h', 3]},
        district: {$arrayElemAt: ['$address_h', 2]},
        commune: {$arrayElemAt: ['$address_h', 1]},
        hamlet: {$arrayElemAt: ['$address_h', 0]},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: 1
      }},
      { $group: {
        _id: "$sex",
        count: {$sum: 1}
      }}  
  ])
  .then(response => {
    res.json({
      response
    })
  })
  .catch(err => {
    res.json({
      message: "an error occured"
    })
  })
};

// PROVINCE
const getRatioGenderPerProvince = (req, res, next) => {
  citizen.aggregate([
    { $project: {
        address_h: { $split: ['$temporaryAddress', ' - ']},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: {
          $divide: [
            {
              $subtract: [
                new Date(), '$dateOfBirth'
              ]
            }, (365 * 24 * 60 * 60 * 1000)
          ]
        }
    }}, 
    { $project: {
        province: {$arrayElemAt: ['$address_h', 3]},
        district: {$arrayElemAt: ['$address_h', 2]},
        commune: {$arrayElemAt: ['$address_h', 1]},
        hamlet: {$arrayElemAt: ['$address_h', 0]},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: 1
      }},
      {
        $addFields: {
          'temporaryAddress.province': "$province",
          'temporaryAddress.district': "$district",
          'temporaryAddress.commune': "$commune",
          'temporaryAddress.hamlet': "$hamlet"
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      {
        $match: {
          'temporaryAddress.province': req.body.province
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      { $group: {
        _id: "$sex",
        count: {
          $sum: 1
        }
      }}
  ])
  .then(response => {
    res.json({
      response
    })
  })
  .catch(err => {
    res.json({
      message: "an error occured"
    })
  })
};

// GROUP OF PROVINCE 
const getRatioGenderPerProvinceGroup = (req, res, next) => {
  citizen.aggregate([
    { $project: {
        address_h: { $split: ['$temporaryAddress', ' - ']},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: {
          $divide: [
            {
              $subtract: [
                new Date(), '$dateOfBirth'
              ]
            }, (365 * 24 * 60 * 60 * 1000)
          ]
        }
    }}, 
    { $project: {
        province: {$arrayElemAt: ['$address_h', 3]},
        district: {$arrayElemAt: ['$address_h', 2]},
        commune: {$arrayElemAt: ['$address_h', 1]},
        hamlet: {$arrayElemAt: ['$address_h', 0]},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: 1
      }},
      {
        $addFields: {
          'temporaryAddress.province': "$province",
          'temporaryAddress.district': "$district",
          'temporaryAddress.commune': "$commune",
          'temporaryAddress.hamlet': "$hamlet"
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1,
          element: {
            $split: [req.body.province, ","]
          }
        }        
      },
      {
        $match: {
          'temporaryAddress.province': {
            $in: [req.body.province1, req.body.province2, req.body.province3, req.body.province4, req.body.province5]
            //$in: ["$element"]
            // $in: {
            //   $arrayElemAt: ["$element", ]
            // }
          }
        }       
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      { $group: {
        _id: "$sex",
        count: {
          $sum: 1
        }
      }}
  ])
  .then(response => {
    res.json({
      response
    })
  })
  .catch(err => {
    res.json({
      message: "an error occured"
    })
  })
};

// DISTRICT
const getRatioGenderPerProvinceDistrict = (req, res, next) => {
  citizen.aggregate([
    { $project: {
        address_h: { $split: ['$temporaryAddress', ' - ']},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: {
          $divide: [
            {
              $subtract: [
                new Date(), '$dateOfBirth'
              ]
            }, (365 * 24 * 60 * 60 * 1000)
          ]
        }
    }}, 
    { $project: {
        province: {$arrayElemAt: ['$address_h', 3]},
        district: {$arrayElemAt: ['$address_h', 2]},
        commune: {$arrayElemAt: ['$address_h', 1]},
        hamlet: {$arrayElemAt: ['$address_h', 0]},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: 1
      }},
      {
        $addFields: {
          'temporaryAddress.province': "$province",
          'temporaryAddress.district': "$district",
          'temporaryAddress.commune': "$commune",
          'temporaryAddress.hamlet': "$hamlet"
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      {
        $match: {
          'temporaryAddress.province': req.body.province,
          'temporaryAddress.district': req.body.district
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      { $group: {
        _id: "$sex",
        count: {
          $sum: 1
        }
      }}
  ])
  .then(response => {
    res.json({
      response
    })
  })
  .catch(err => {
    res.json({
      message: "an error occured"
    })
  })
};

// GROUP OF DISTRICT
const getRatioGenderPerProvinceDistrictGroup = (req, res, next) => {
  citizen.aggregate([
    { $project: {
        address_h: { $split: ['$temporaryAddress', ' - ']},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: {
          $divide: [
            {
              $subtract: [
                new Date(), '$dateOfBirth'
              ]
            }, (365 * 24 * 60 * 60 * 1000)
          ]
        }
    }}, 
    { $project: {
        province: {$arrayElemAt: ['$address_h', 3]},
        district: {$arrayElemAt: ['$address_h', 2]},
        commune: {$arrayElemAt: ['$address_h', 1]},
        hamlet: {$arrayElemAt: ['$address_h', 0]},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: 1
      }},
      {
        $addFields: {
          'temporaryAddress.province': "$province",
          'temporaryAddress.district': "$district",
          'temporaryAddress.commune': "$commune",
          'temporaryAddress.hamlet': "$hamlet"
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      {
        $match: {
          'temporaryAddress.province': req.body.province,
          'temporaryAddress.district': {
            $in: [req.body.district1, req.body.district2, req.body.district3, req.body.district4, req.body.district5]
          }
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      { $group: {
        _id: "$sex",
        count: {
          $sum: 1
        }
      }}
  ])
  .then(response => {
    res.json({
      response
    })
  })
  .catch(err => {
    res.json({
      message: "an error occured"
    })
  })
};

// COMMUNE
const getRatioGenderPerProvinceDistrictCommune = (req, res, next) => {
  citizen.aggregate([
    { $project: {
        address_h: { $split: ['$temporaryAddress', ' - ']},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: {
          $divide: [
            {
              $subtract: [
                new Date(), '$dateOfBirth'
              ]
            }, (365 * 24 * 60 * 60 * 1000)
          ]
        }
    }}, 
    { $project: {
        province: {$arrayElemAt: ['$address_h', 3]},
        district: {$arrayElemAt: ['$address_h', 2]},
        commune: {$arrayElemAt: ['$address_h', 1]},
        hamlet: {$arrayElemAt: ['$address_h', 0]},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: 1
      }},
      {
        $addFields: {
          'temporaryAddress.province': "$province",
          'temporaryAddress.district': "$district",
          'temporaryAddress.commune': "$commune",
          'temporaryAddress.hamlet': "$hamlet"
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      {
        $match: {
          'temporaryAddress.province': req.body.province,
          'temporaryAddress.district': req.body.district,
          'temporaryAddress.commune': req.body.commune
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      { $group: {
        _id: "$sex",
        count: {
          $sum: 1
        }
      }}
  ])
  .then(response => {
    res.json({
      response
    })
  })
  .catch(err => {
    res.json({
      message: "an error occured"
    })
  })
};

// GROUP OF COMMUNE
const getRatioGenderPerProvinceDistrictCommuneGroup = (req, res, next) => {
  citizen.aggregate([
    { $project: {
        address_h: { $split: ['$temporaryAddress', ' - ']},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: {
          $divide: [
            {
              $subtract: [
                new Date(), '$dateOfBirth'
              ]
            }, (365 * 24 * 60 * 60 * 1000)
          ]
        }
    }}, 
    { $project: {
        province: {$arrayElemAt: ['$address_h', 3]},
        district: {$arrayElemAt: ['$address_h', 2]},
        commune: {$arrayElemAt: ['$address_h', 1]},
        hamlet: {$arrayElemAt: ['$address_h', 0]},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: 1
      }},
      {
        $addFields: {
          'temporaryAddress.province': "$province",
          'temporaryAddress.district': "$district",
          'temporaryAddress.commune': "$commune",
          'temporaryAddress.hamlet': "$hamlet"
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      {
        $match: {
          'temporaryAddress.province': req.body.province,
          'temporaryAddress.district': req.body.district,
          'temporaryAddress.commune': {
            $in: [req.body.commune1, req.body.commune2, req.body.commune3, req.body.commune4, req.body.commune5]
          }
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      { $group: {
        _id: "$sex",
        count: {
          $sum: 1
        }
      }}
  ])
  .then(response => {
    res.json({
      response
    })
  })
  .catch(err => {
    res.json({
      message: "an error occured"
    })
  })
};
//////////////////////////
/* Average Age */
// NATION
const getAveAge = (req, res, next) => {
  citizen.aggregate([
    { 
      $project: {
        age: {
          $divide: [
            {
              $subtract: [
                new Date(), '$dateOfBirth'
              ]
            }, (365 * 24 * 60 * 60 * 1000)
          ]
        }
    }},
    {
      $project: {
        averageAge: {
          "$avg": "$age"
        }
      }
    }
  ])
  .then(response => {
    res.json({
      response
    })
  })
  .catch(err => {
    res.json({
      message: "an error occured"
    })
  })
};

// PROVINCE --> avg age of province
const getAveAgePerProvince = (req, res, next) => {
  citizen.aggregate([
    { $project: {
        address_h: { $split: ['$temporaryAddress', '-']},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: {
          $divide: [
            {
              $subtract: [
                new Date(), '$dateOfBirth'
              ]
            }, (365 * 24 * 60 * 60 * 1000)
          ]
        }
    }}, 
    { $project: {
        province: {$arrayElemAt: ['$address_h', 3]},
        district: {$arrayElemAt: ['$address_h', 2]},
        commune: {$arrayElemAt: ['$address_h', 1]},
        hamlet: {$arrayElemAt: ['$address_h', 0]},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: 1
      }},
      { $group: {
        _id: "$province",
        averageAge: {
          "$avg": "$age"
        }
      }} 
  ])
  .then(response => {
    res.json({
      response
    })
  })
  .catch(err => {
    res.json({
      message: "an error occured"
    })
  })
};

// DISTRICT
const getAveAgePerProvinceDistrict = (req, res, next) => {
  citizen.aggregate([
    { $project: {
        address_h: { $split: ['$temporaryAddress', '-']},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: {
          $divide: [
            {
              $subtract: [
                new Date(), '$dateOfBirth'
              ]
            }, (365 * 24 * 60 * 60 * 1000)
          ]
        }
    }}, 
    { $project: {
        province: {$arrayElemAt: ['$address_h', 3]},
        district: {$arrayElemAt: ['$address_h', 2]},
        commune: {$arrayElemAt: ['$address_h', 1]},
        hamlet: {$arrayElemAt: ['$address_h', 0]},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: 1
      }},
      { $group: {
        _id: "$district",
        averageAge: {
          "$avg": "$age"
        }
      }} 
  ])
  .then(response => {
    res.json({
      response
    })
  })
  .catch(err => {
    res.json({
      message: "an error occured"
    })
  })
};

// COMMUNE
const getAveAgePerProvinceDistrictCommune = (req, res, next) => {
  citizen.aggregate([
    { $project: {
        address_h: { $split: ['$temporaryAddress', '-']},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: {
          $divide: [
            {
              $subtract: [
                new Date(), '$dateOfBirth'
              ]
            }, (365 * 24 * 60 * 60 * 1000)
          ]
        }
    }}, 
    { $project: {
        province: {$arrayElemAt: ['$address_h', 3]},
        district: {$arrayElemAt: ['$address_h', 2]},
        commune: {$arrayElemAt: ['$address_h', 1]},
        hamlet: {$arrayElemAt: ['$address_h', 0]},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: 1
      }},
      { $group: {
        _id: "$commune",
        averageAge: {
          "$avg": "$age"
        }
      }} 
  ])
  .then(response => {
    res.json({
      response
    })
  })
  .catch(err => {
    res.json({
      message: "an error occured"
    })
  })
};


/* EducationLevel Ratio */
// NATION 
const getEducationLevelRatio = (req, res, next) => {
  citizen.aggregate([
    { $project: {
        address_h: { $split: ['$temporaryAddress', '-']},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: {
          $divide: [
            {
              $subtract: [
                new Date(), '$dateOfBirth'
              ]
            }, (365 * 24 * 60 * 60 * 1000)
          ]
        }
    }}, 
    { $project: {
        province: {$arrayElemAt: ['$address_h', 3]},
        district: {$arrayElemAt: ['$address_h', 2]},
        commune: {$arrayElemAt: ['$address_h', 1]},
        hamlet: {$arrayElemAt: ['$address_h', 0]},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: 1
      }},
      { $group: {
        _id: "$educationLevel",
        count: {
          $sum: 1
        }
        }
      }
  ])
  .then(response => {
    res.json({
      response
    })
  })
  .catch(err => {
    res.json({
      message: "an error occured"
    })
  })
};

// PROVINCE
const getEducationLevelRatioPerProvince = (req, res, next) => {
  citizen.aggregate([
    { $project: {
        address_h: { $split: ['$temporaryAddress', ' - ']},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: {
          $divide: [
            {
              $subtract: [
                new Date(), '$dateOfBirth'
              ]
            }, (365 * 24 * 60 * 60 * 1000)
          ]
        }
    }}, 
    { $project: {
        province: {$arrayElemAt: ['$address_h', 3]},
        district: {$arrayElemAt: ['$address_h', 2]},
        commune: {$arrayElemAt: ['$address_h', 1]},
        hamlet: {$arrayElemAt: ['$address_h', 0]},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: 1
      }},
      {
        $addFields: {
          'temporaryAddress.province': "$province",
          'temporaryAddress.district': "$district",
          'temporaryAddress.commune': "$commune",
          'temporaryAddress.hamlet': "$hamlet"
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      {
        $match: {
          'temporaryAddress.province': req.body.province
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      { $group: {
        _id: "$educationLevel",
        count: {
          $sum: 1
        }
      }}
  ])
  .then(response => {
    res.json({
      response
    })
  })
  .catch(err => {
    res.json({
      message: "an error occured"
    })
  })
};

// GROUP OF PROVINCE 
const getEducationLevelRatioPerProvinceGroup = (req, res, next) => {
  citizen.aggregate([
    { $project: {
        address_h: { $split: ['$temporaryAddress', ' - ']},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: {
          $divide: [
            {
              $subtract: [
                new Date(), '$dateOfBirth'
              ]
            }, (365 * 24 * 60 * 60 * 1000)
          ]
        }
    }}, 
    { $project: {
        province: {$arrayElemAt: ['$address_h', 3]},
        district: {$arrayElemAt: ['$address_h', 2]},
        commune: {$arrayElemAt: ['$address_h', 1]},
        hamlet: {$arrayElemAt: ['$address_h', 0]},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: 1
      }},
      {
        $addFields: {
          'temporaryAddress.province': "$province",
          'temporaryAddress.district': "$district",
          'temporaryAddress.commune': "$commune",
          'temporaryAddress.hamlet': "$hamlet"
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1,
          element: {
            $split: [req.body.province, ","]
          }
        }        
      },
      {
        $match: {
          'temporaryAddress.province': {
            $in: [req.body.province1, req.body.province2, req.body.province3, req.body.province4, req.body.province5]
            //$in: ["$element"]
            // $in: {
            //   $arrayElemAt: ["$element", ]
            // }
          }
        }       
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      { $group: {
        _id: "$educationLevel",
        count: {
          $sum: 1
        }
      }}
  ])
  .then(response => {
    res.json({
      response
    })
  })
  .catch(err => {
    res.json({
      message: "an error occured"
    })
  })
};

// DISTRICT
const getEducationLevelRatioPerProvinceDistrict = (req, res, next) => {
  citizen.aggregate([
    { $project: {
        address_h: { $split: ['$temporaryAddress', ' - ']},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: {
          $divide: [
            {
              $subtract: [
                new Date(), '$dateOfBirth'
              ]
            }, (365 * 24 * 60 * 60 * 1000)
          ]
        }
    }}, 
    { $project: {
        province: {$arrayElemAt: ['$address_h', 3]},
        district: {$arrayElemAt: ['$address_h', 2]},
        commune: {$arrayElemAt: ['$address_h', 1]},
        hamlet: {$arrayElemAt: ['$address_h', 0]},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: 1
      }},
      {
        $addFields: {
          'temporaryAddress.province': "$province",
          'temporaryAddress.district': "$district",
          'temporaryAddress.commune': "$commune",
          'temporaryAddress.hamlet': "$hamlet"
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      {
        $match: {
          'temporaryAddress.province': req.body.province,
          'temporaryAddress.district': req.body.district
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      { $group: {
        _id: "$educationLevel",
        count: {
          $sum: 1
        }
      }}
  ])
  .then(response => {
    res.json({
      response
    })
  })
  .catch(err => {
    res.json({
      message: "an error occured"
    })
  })
};

// GROUP OF DISTRICT
const getEducationLevelRatioPerProvinceDistrictGroup = (req, res, next) => {
  citizen.aggregate([
    { $project: {
        address_h: { $split: ['$temporaryAddress', ' - ']},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: {
          $divide: [
            {
              $subtract: [
                new Date(), '$dateOfBirth'
              ]
            }, (365 * 24 * 60 * 60 * 1000)
          ]
        }
    }}, 
    { $project: {
        province: {$arrayElemAt: ['$address_h', 3]},
        district: {$arrayElemAt: ['$address_h', 2]},
        commune: {$arrayElemAt: ['$address_h', 1]},
        hamlet: {$arrayElemAt: ['$address_h', 0]},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: 1
      }},
      {
        $addFields: {
          'temporaryAddress.province': "$province",
          'temporaryAddress.district': "$district",
          'temporaryAddress.commune': "$commune",
          'temporaryAddress.hamlet': "$hamlet"
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      {
        $match: {
          'temporaryAddress.province': req.body.province,
          'temporaryAddress.district': {
            $in: [req.body.district1, req.body.district2, req.body.district3, req.body.district4, req.body.district5]
          }
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      { $group: {
        _id: "$educationLevel",
        count: {
          $sum: 1
        }
      }}
  ])
  .then(response => {
    res.json({
      response
    })
  })
  .catch(err => {
    res.json({
      message: "an error occured"
    })
  })
};

// COMMUNE
const getEducationLevelRatioPerProvinceDistrictCommune = (req, res, next) => {
  citizen.aggregate([
    { $project: {
        address_h: { $split: ['$temporaryAddress', ' - ']},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: {
          $divide: [
            {
              $subtract: [
                new Date(), '$dateOfBirth'
              ]
            }, (365 * 24 * 60 * 60 * 1000)
          ]
        }
    }}, 
    { $project: {
        province: {$arrayElemAt: ['$address_h', 3]},
        district: {$arrayElemAt: ['$address_h', 2]},
        commune: {$arrayElemAt: ['$address_h', 1]},
        hamlet: {$arrayElemAt: ['$address_h', 0]},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: 1
      }},
      {
        $addFields: {
          'temporaryAddress.province': "$province",
          'temporaryAddress.district': "$district",
          'temporaryAddress.commune': "$commune",
          'temporaryAddress.hamlet': "$hamlet"
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      {
        $match: {
          'temporaryAddress.province': req.body.province,
          'temporaryAddress.district': req.body.district,
          'temporaryAddress.commune': req.body.commune
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      { $group: {
        _id: "$educationLevel",
        count: {
          $sum: 1
        }
      }}
  ])
  .then(response => {
    res.json({
      response
    })
  })
  .catch(err => {
    res.json({
      message: "an error occured"
    })
  })
};

// GROUP OF COMMUNE
const getEducationLevelRatioPerProvinceDistrictCommuneGroup = (req, res, next) => {
  citizen.aggregate([
    { $project: {
        address_h: { $split: ['$temporaryAddress', ' - ']},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: {
          $divide: [
            {
              $subtract: [
                new Date(), '$dateOfBirth'
              ]
            }, (365 * 24 * 60 * 60 * 1000)
          ]
        }
    }}, 
    { $project: {
        province: {$arrayElemAt: ['$address_h', 3]},
        district: {$arrayElemAt: ['$address_h', 2]},
        commune: {$arrayElemAt: ['$address_h', 1]},
        hamlet: {$arrayElemAt: ['$address_h', 0]},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: 1
      }},
      {
        $addFields: {
          'temporaryAddress.province': "$province",
          'temporaryAddress.district': "$district",
          'temporaryAddress.commune': "$commune",
          'temporaryAddress.hamlet': "$hamlet"
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      {
        $match: {
          'temporaryAddress.province': req.body.province,
          'temporaryAddress.district': req.body.district,
          'temporaryAddress.commune': {
            $in: [req.body.commune1, req.body.commune2, req.body.commune3, req.body.commune4, req.body.commune5]
          }
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      { $group: {
        _id: "$educationLevel",
        count: {
          $sum: 1
        }
      }}
  ])
  .then(response => {
    res.json({
      response
    })
  })
  .catch(err => {
    res.json({
      message: "an error occured"
    })
  })
};

/* Job ratio */
//NATION
const getJobRatio = (req, res, next) => {
  citizen.aggregate([
    { $project: {
        address_h: { $split: ['$temporaryAddress', '-']},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: {
          $divide: [
            {
              $subtract: [
                new Date(), '$dateOfBirth'
              ]
            }, (365 * 24 * 60 * 60 * 1000)
          ]
        }
    }}, 
    { $project: {
        province: {$arrayElemAt: ['$address_h', 3]},
        district: {$arrayElemAt: ['$address_h', 2]},
        commune: {$arrayElemAt: ['$address_h', 1]},
        hamlet: {$arrayElemAt: ['$address_h', 0]},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: 1
      }},
      { $group: {
        _id: "$job",
        count: {
          $sum: 1
        }
        }
      }
  ])
  .then(response => {
    res.json({
      response
    })
  })
  .catch(err => {
    res.json({
      message: "an error occured"
    })
  })
};

// PROVINCE
const getJobRatioPerProvince = (req, res, next) => {
  citizen.aggregate([
    { $project: {
        address_h: { $split: ['$temporaryAddress', ' - ']},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: {
          $divide: [
            {
              $subtract: [
                new Date(), '$dateOfBirth'
              ]
            }, (365 * 24 * 60 * 60 * 1000)
          ]
        }
    }}, 
    { $project: {
        province: {$arrayElemAt: ['$address_h', 3]},
        district: {$arrayElemAt: ['$address_h', 2]},
        commune: {$arrayElemAt: ['$address_h', 1]},
        hamlet: {$arrayElemAt: ['$address_h', 0]},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: 1
      }},
      {
        $addFields: {
          'temporaryAddress.province': "$province",
          'temporaryAddress.district': "$district",
          'temporaryAddress.commune': "$commune",
          'temporaryAddress.hamlet': "$hamlet"
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      {
        $match: {
          'temporaryAddress.province': req.body.province
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      { $group: {
        _id: "$job",
        count: {
          $sum: 1
        }
      }}
  ])
  .then(response => {
    res.json({
      response
    })
  })
  .catch(err => {
    res.json({
      message: "an error occured"
    })
  })
};

// GROUP OF PROVINCE 
const getJobRatioPerProvinceGroup = (req, res, next) => {
  citizen.aggregate([
    { $project: {
        address_h: { $split: ['$temporaryAddress', ' - ']},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: {
          $divide: [
            {
              $subtract: [
                new Date(), '$dateOfBirth'
              ]
            }, (365 * 24 * 60 * 60 * 1000)
          ]
        }
    }}, 
    { $project: {
        province: {$arrayElemAt: ['$address_h', 3]},
        district: {$arrayElemAt: ['$address_h', 2]},
        commune: {$arrayElemAt: ['$address_h', 1]},
        hamlet: {$arrayElemAt: ['$address_h', 0]},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: 1
      }},
      {
        $addFields: {
          'temporaryAddress.province': "$province",
          'temporaryAddress.district': "$district",
          'temporaryAddress.commune': "$commune",
          'temporaryAddress.hamlet': "$hamlet"
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1,
          element: {
            $split: [req.body.province, ","]
          }
        }        
      },
      {
        $match: {
          'temporaryAddress.province': {
            $in: [req.body.province1, req.body.province2, req.body.province3, req.body.province4, req.body.province5]
            //$in: ["$element"]
            // $in: {
            //   $arrayElemAt: ["$element", ]
            // }
          }
        }       
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      { $group: {
        _id: "$job",
        count: {
          $sum: 1
        }
      }}
  ])
  .then(response => {
    res.json({
      response
    })
  })
  .catch(err => {
    res.json({
      message: "an error occured"
    })
  })
};

// DISTRICT
const getJobRatioPerProvinceDistrict = (req, res, next) => {
  citizen.aggregate([
    { $project: {
        address_h: { $split: ['$temporaryAddress', ' - ']},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: {
          $divide: [
            {
              $subtract: [
                new Date(), '$dateOfBirth'
              ]
            }, (365 * 24 * 60 * 60 * 1000)
          ]
        }
    }}, 
    { $project: {
        province: {$arrayElemAt: ['$address_h', 3]},
        district: {$arrayElemAt: ['$address_h', 2]},
        commune: {$arrayElemAt: ['$address_h', 1]},
        hamlet: {$arrayElemAt: ['$address_h', 0]},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: 1
      }},
      {
        $addFields: {
          'temporaryAddress.province': "$province",
          'temporaryAddress.district': "$district",
          'temporaryAddress.commune': "$commune",
          'temporaryAddress.hamlet': "$hamlet"
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      {
        $match: {
          'temporaryAddress.province': req.body.province,
          'temporaryAddress.district': req.body.district
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      { $group: {
        _id: "$job",
        count: {
          $sum: 1
        }
      }}
  ])
  .then(response => {
    res.json({
      response
    })
  })
  .catch(err => {
    res.json({
      message: "an error occured"
    })
  })
};

// GROUP OF DISTRICT
const getJobRatioPerProvinceDistrictGroup = (req, res, next) => {
  citizen.aggregate([
    { $project: {
        address_h: { $split: ['$temporaryAddress', ' - ']},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: {
          $divide: [
            {
              $subtract: [
                new Date(), '$dateOfBirth'
              ]
            }, (365 * 24 * 60 * 60 * 1000)
          ]
        }
    }}, 
    { $project: {
        province: {$arrayElemAt: ['$address_h', 3]},
        district: {$arrayElemAt: ['$address_h', 2]},
        commune: {$arrayElemAt: ['$address_h', 1]},
        hamlet: {$arrayElemAt: ['$address_h', 0]},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: 1
      }},
      {
        $addFields: {
          'temporaryAddress.province': "$province",
          'temporaryAddress.district': "$district",
          'temporaryAddress.commune': "$commune",
          'temporaryAddress.hamlet': "$hamlet"
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      {
        $match: {
          'temporaryAddress.province': req.body.province,
          'temporaryAddress.district': {
            $in: [req.body.district1, req.body.district2, req.body.district3, req.body.district4, req.body.district5]
          }
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      { $group: {
        _id: "$job",
        count: {
          $sum: 1
        }
      }}
  ])
  .then(response => {
    res.json({
      response
    })
  })
  .catch(err => {
    res.json({
      message: "an error occured"
    })
  })
};

// COMMUNE
const getJobRatioPerProvinceDistrictCommune = (req, res, next) => {
  citizen.aggregate([
    { $project: {
        address_h: { $split: ['$temporaryAddress', ' - ']},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: {
          $divide: [
            {
              $subtract: [
                new Date(), '$dateOfBirth'
              ]
            }, (365 * 24 * 60 * 60 * 1000)
          ]
        }
    }}, 
    { $project: {
        province: {$arrayElemAt: ['$address_h', 3]},
        district: {$arrayElemAt: ['$address_h', 2]},
        commune: {$arrayElemAt: ['$address_h', 1]},
        hamlet: {$arrayElemAt: ['$address_h', 0]},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: 1
      }},
      {
        $addFields: {
          'temporaryAddress.province': "$province",
          'temporaryAddress.district': "$district",
          'temporaryAddress.commune': "$commune",
          'temporaryAddress.hamlet': "$hamlet"
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      {
        $match: {
          'temporaryAddress.province': req.body.province,
          'temporaryAddress.district': req.body.district,
          'temporaryAddress.commune': req.body.commune
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      { $group: {
        _id: "$job",
        count: {
          $sum: 1
        }
      }}
  ])
  .then(response => {
    res.json({
      response
    })
  })
  .catch(err => {
    res.json({
      message: "an error occured"
    })
  })
};

// GROUP OF COMMUNE
const getJobRatioPerProvinceDistrictCommuneGroup = (req, res, next) => {
  citizen.aggregate([
    { $project: {
        address_h: { $split: ['$temporaryAddress', ' - ']},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: {
          $divide: [
            {
              $subtract: [
                new Date(), '$dateOfBirth'
              ]
            }, (365 * 24 * 60 * 60 * 1000)
          ]
        }
    }}, 
    { $project: {
        province: {$arrayElemAt: ['$address_h', 3]},
        district: {$arrayElemAt: ['$address_h', 2]},
        commune: {$arrayElemAt: ['$address_h', 1]},
        hamlet: {$arrayElemAt: ['$address_h', 0]},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: 1
      }},
      {
        $addFields: {
          'temporaryAddress.province': "$province",
          'temporaryAddress.district': "$district",
          'temporaryAddress.commune': "$commune",
          'temporaryAddress.hamlet': "$hamlet"
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      {
        $match: {
          'temporaryAddress.province': req.body.province,
          'temporaryAddress.district': req.body.district,
          'temporaryAddress.commune': {
            $in: [req.body.commune1, req.body.commune2, req.body.commune3, req.body.commune4, req.body.commune5]
          }
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      { $group: {
        _id: "$job",
        count: {
          $sum: 1
        }
      }}
  ])
  .then(response => {
    res.json({
      response
    })
  })
  .catch(err => {
    res.json({
      message: "an error occured"
    })
  })
};

/* Religion ratio */
// NATION
const getReligionRatio = (req, res, next) => {
  citizen.aggregate([
    { $project: {
        address_h: { $split: ['$temporaryAddress', ' - ']},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: {
          $divide: [
            {
              $subtract: [
                new Date(), '$dateOfBirth'
              ]
            }, (365 * 24 * 60 * 60 * 1000)
          ]
        }
    }}, 
    { $project: {
        province: {$arrayElemAt: ['$address_h', 3]},
        district: {$arrayElemAt: ['$address_h', 2]},
        commune: {$arrayElemAt: ['$address_h', 1]},
        hamlet: {$arrayElemAt: ['$address_h', 0]},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: 1
      }},
      { $group: {
        _id: "$religion",
        count: {
          $sum: 1
        }
        }
      }
  ])
  .then(response => {
    res.json({
      response
    })
  })
  .catch(err => {
    res.json({
      message: "an error occured"
    })
  })
};

//PROVINCE
const getReligionRatioPerProvince = (req, res, next) => {
  citizen.aggregate([
    { $project: {
        address_h: { $split: ['$temporaryAddress', ' - ']},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: {
          $divide: [
            {
              $subtract: [
                new Date(), '$dateOfBirth'
              ]
            }, (365 * 24 * 60 * 60 * 1000)
          ]
        }
    }}, 
    { $project: {
        province: {$arrayElemAt: ['$address_h', 3]},
        district: {$arrayElemAt: ['$address_h', 2]},
        commune: {$arrayElemAt: ['$address_h', 1]},
        hamlet: {$arrayElemAt: ['$address_h', 0]},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: 1
      }},
      {
        $addFields: {
          'temporaryAddress.province': "$province",
          'temporaryAddress.district': "$district",
          'temporaryAddress.commune': "$commune",
          'temporaryAddress.hamlet': "$hamlet"
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      {
        $match: {
          'temporaryAddress.province': req.body.province
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      { $group: {
        _id: "$religion",
        count: {
          $sum: 1
        }
      }}
  ])
  .then(response => {
    res.json({
      response
    })
  })
  .catch(err => {
    res.json({
      message: "an error occured"
    })
  })
};

// GROUP OF PROVINCE 
const getReligionRatioPerProvinceGroup = (req, res, next) => {
  citizen.aggregate([
    { $project: {
        address_h: { $split: ['$temporaryAddress', ' - ']},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: {
          $divide: [
            {
              $subtract: [
                new Date(), '$dateOfBirth'
              ]
            }, (365 * 24 * 60 * 60 * 1000)
          ]
        }
    }}, 
    { $project: {
        province: {$arrayElemAt: ['$address_h', 3]},
        district: {$arrayElemAt: ['$address_h', 2]},
        commune: {$arrayElemAt: ['$address_h', 1]},
        hamlet: {$arrayElemAt: ['$address_h', 0]},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: 1
      }},
      {
        $addFields: {
          'temporaryAddress.province': "$province",
          'temporaryAddress.district': "$district",
          'temporaryAddress.commune': "$commune",
          'temporaryAddress.hamlet': "$hamlet"
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1,
          element: {
            $split: [req.body.province, ","]
          }
        }        
      },
      {
        $match: {
          'temporaryAddress.province': {
            $in: [req.body.province1, req.body.province2, req.body.province3, req.body.province4, req.body.province5]
            //$in: ["$element"]
            // $in: {
            //   $arrayElemAt: ["$element", ]
            // }
          }
        }       
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      { $group: {
        _id: "$religion",
        count: {
          $sum: 1
        }
      }}
  ])
  .then(response => {
    res.json({
      response
    })
  })
  .catch(err => {
    res.json({
      message: "an error occured"
    })
  })
};

// DISTRICT
const getReligionRatioPerProvinceDistrict = (req, res, next) => {
  citizen.aggregate([
    { $project: {
        address_h: { $split: ['$temporaryAddress', ' - ']},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: {
          $divide: [
            {
              $subtract: [
                new Date(), '$dateOfBirth'
              ]
            }, (365 * 24 * 60 * 60 * 1000)
          ]
        }
    }}, 
    { $project: {
        province: {$arrayElemAt: ['$address_h', 3]},
        district: {$arrayElemAt: ['$address_h', 2]},
        commune: {$arrayElemAt: ['$address_h', 1]},
        hamlet: {$arrayElemAt: ['$address_h', 0]},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: 1
      }},
      {
        $addFields: {
          'temporaryAddress.province': "$province",
          'temporaryAddress.district': "$district",
          'temporaryAddress.commune': "$commune",
          'temporaryAddress.hamlet': "$hamlet"
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      {
        $match: {
          'temporaryAddress.province': req.body.province,
          'temporaryAddress.district': req.body.district
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      { $group: {
        _id: "$religion",
        count: {
          $sum: 1
        }
      }}
  ])
  .then(response => {
    res.json({
      response
    })
  })
  .catch(err => {
    res.json({
      message: "an error occured"
    })
  })
};

// GROUP OF DISTRICT
const getReligionRatioPerProvinceDistrictGroup = (req, res, next) => {
  citizen.aggregate([
    { $project: {
        address_h: { $split: ['$temporaryAddress', ' - ']},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: {
          $divide: [
            {
              $subtract: [
                new Date(), '$dateOfBirth'
              ]
            }, (365 * 24 * 60 * 60 * 1000)
          ]
        }
    }}, 
    { $project: {
        province: {$arrayElemAt: ['$address_h', 3]},
        district: {$arrayElemAt: ['$address_h', 2]},
        commune: {$arrayElemAt: ['$address_h', 1]},
        hamlet: {$arrayElemAt: ['$address_h', 0]},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: 1
      }},
      {
        $addFields: {
          'temporaryAddress.province': "$province",
          'temporaryAddress.district': "$district",
          'temporaryAddress.commune': "$commune",
          'temporaryAddress.hamlet': "$hamlet"
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      {
        $match: {
          'temporaryAddress.province': req.body.province,
          'temporaryAddress.district': {
            $in: [req.body.district1, req.body.district2, req.body.district3, req.body.district4, req.body.district5]
          }
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      { $group: {
        _id: "$religion",
        count: {
          $sum: 1
        }
      }}
  ])
  .then(response => {
    res.json({
      response
    })
  })
  .catch(err => {
    res.json({
      message: "an error occured"
    })
  })
};

// COMMUNE
const getReligionRatioPerProvinceDistrictCommune = (req, res, next) => {
  citizen.aggregate([
    { $project: {
        address_h: { $split: ['$temporaryAddress', ' - ']},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: {
          $divide: [
            {
              $subtract: [
                new Date(), '$dateOfBirth'
              ]
            }, (365 * 24 * 60 * 60 * 1000)
          ]
        }
    }}, 
    { $project: {
        province: {$arrayElemAt: ['$address_h', 3]},
        district: {$arrayElemAt: ['$address_h', 2]},
        commune: {$arrayElemAt: ['$address_h', 1]},
        hamlet: {$arrayElemAt: ['$address_h', 0]},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: 1
      }},
      {
        $addFields: {
          'temporaryAddress.province': "$province",
          'temporaryAddress.district': "$district",
          'temporaryAddress.commune': "$commune",
          'temporaryAddress.hamlet': "$hamlet"
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      {
        $match: {
          'temporaryAddress.province': req.body.province,
          'temporaryAddress.district': req.body.district,
          'temporaryAddress.commune': req.body.commune
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      { $group: {
        _id: "$religion",
        count: {
          $sum: 1
        }
      }}
  ])
  .then(response => {
    res.json({
      response
    })
  })
  .catch(err => {
    res.json({
      message: "an error occured"
    })
  })
};

// GROUP OF COMMUNE
const getReligionRatioPerProvinceDistrictCommuneGroup = (req, res, next) => {
  citizen.aggregate([
    { $project: {
        address_h: { $split: ['$temporaryAddress', ' - ']},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: {
          $divide: [
            {
              $subtract: [
                new Date(), '$dateOfBirth'
              ]
            }, (365 * 24 * 60 * 60 * 1000)
          ]
        }
    }}, 
    { $project: {
        province: {$arrayElemAt: ['$address_h', 3]},
        district: {$arrayElemAt: ['$address_h', 2]},
        commune: {$arrayElemAt: ['$address_h', 1]},
        hamlet: {$arrayElemAt: ['$address_h', 0]},
        IDNumber: 1,
        fullName: 1,
        dateOfBirth: 1,
        sex: 1,
        permanentAddress: 1,
        temporaryAddress: 1,
        religion: 1,
        educationLevel: 1,
        job: 1,
        age: 1
      }},
      {
        $addFields: {
          'temporaryAddress.province': "$province",
          'temporaryAddress.district': "$district",
          'temporaryAddress.commune': "$commune",
          'temporaryAddress.hamlet': "$hamlet"
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      {
        $match: {
          'temporaryAddress.province': req.body.province,
          'temporaryAddress.district': req.body.district,
          'temporaryAddress.commune': {
            $in: [req.body.commune1, req.body.commune2, req.body.commune3, req.body.commune4, req.body.commune5]
          }
        }
      },
      {
        $project: {
          province: 1,
          district: 1,
          commune: 1,
          hamlet: 1,
          IDNumber: 1,
          fullName: 1,
          dateOfBirth: 1,
          sex: 1,
          permanentAddress: 1,
          temporaryAddress: 1,
          religion: 1,
          educationLevel: 1,
          job: 1,
          age: 1
        }        
      },
      { $group: {
        _id: "$religion",
        count: {
          $sum: 1
        }
      }}
  ])
  .then(response => {
    res.json({
      response
    })
  })
  .catch(err => {
    res.json({
      message: "an error occured"
    })
  })
};

module.exports = {
  getRatioGender, 
  getRatioGenderPerProvince, 
  getRatioGenderPerProvinceGroup,
  getRatioGenderPerProvinceDistrict,
  getRatioGenderPerProvinceDistrictGroup,
  getRatioGenderPerProvinceDistrictCommune,
  getRatioGenderPerProvinceDistrictCommuneGroup,
  getAveAge,
  getAveAgePerProvince,
  getAveAgePerProvinceDistrict,
  getAveAgePerProvinceDistrictCommune,
  getEducationLevelRatio,
  getEducationLevelRatioPerProvince,
  getEducationLevelRatioPerProvinceGroup,
  getEducationLevelRatioPerProvinceDistrict,
  getEducationLevelRatioPerProvinceDistrictGroup,
  getEducationLevelRatioPerProvinceDistrictCommune,
  getEducationLevelRatioPerProvinceDistrictCommuneGroup,
  getJobRatio,
  getJobRatioPerProvince,
  getJobRatioPerProvinceGroup,
  getJobRatioPerProvinceDistrict,
  getJobRatioPerProvinceDistrictGroup,
  getJobRatioPerProvinceDistrictCommune,
  getJobRatioPerProvinceDistrictCommuneGroup,
  getReligionRatio,
  getReligionRatioPerProvince,
  getReligionRatioPerProvinceDistrict,
  getReligionRatioPerProvinceGroup,
  getReligionRatioPerProvinceDistrictGroup,
  getReligionRatioPerProvinceDistrictCommune,
  getReligionRatioPerProvinceDistrictCommuneGroup
}