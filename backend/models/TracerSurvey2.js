import mongoose from "mongoose";

const TracerSurvey2Schema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Student', 
      required: true 
    },
    surveyType: {
      type: String,
      default: "Tracer2",
      immutable: true
    },
    date: { 
      type: Date, 
      default: Date.now 
    },
    education: [{
      degreeType: [String],   // ✅ renamed from "type" to avoid conflict
      college: [String],
      course: [String],
      yearGraduated: String,
      institution: String
    }],
    noExams: Boolean,
    examinations: {
      type: [{
        examName: String,
        dateTaken: String,
        rating: String
      }],
      validate: {
        validator: function (value) {
          if (this.noExams) return value.length === 0;
          return true;
        },
        message: "Examinations must be empty when 'noExams' is selected."
      }
    },

    reasons: {
      highGradesRelated: { undergraduate: Boolean, graduate: Boolean },
      goodHighSchoolGrades: { undergraduate: Boolean, graduate: Boolean },
      parentInfluence: { undergraduate: Boolean, graduate: Boolean },
      peerInfluence: { undergraduate: Boolean, graduate: Boolean },
      roleModel: { undergraduate: Boolean, graduate: Boolean },
      passion: { undergraduate: Boolean, graduate: Boolean },
      employmentProspects: { undergraduate: Boolean, graduate: Boolean },
      professionPrestige: { undergraduate: Boolean, graduate: Boolean },
      courseAvailability: { undergraduate: Boolean, graduate: Boolean },
      careerAdvancement: { undergraduate: Boolean, graduate: Boolean },
      affordability: { undergraduate: Boolean, graduate: Boolean },
      attractiveCompensation: { undergraduate: Boolean, graduate: Boolean },
      abroadEmployment: { undergraduate: Boolean, graduate: Boolean },
      noChoice: { undergraduate: Boolean, graduate: Boolean }
    },
    noTrainings: Boolean,
    trainings: {
      type: [{
        title: String,
        duration: String,
        institution: String
      }],
      validate: {
        validator: function (value) {
          if (this.noTrainings) return value.length === 0;
          return true;
        },
        message: "Trainings must be empty when 'noTrainings' is selected."
      }
    },
    motivation: {
      promotion: Boolean,
      professionalDevelopment: Boolean,
      personalInterest: Boolean,
      scholarship: Boolean,
      careerShift: Boolean,
      others: Boolean
    },
    employmentStatus: {
      type: String,
      enum: ["permanent", "contractual", "temporary", "selfEmployed", "unemployed"],
      required: true
    },
    // Change these fields in your schema:
    unemploymentReasons: {
      furtherStudy: Boolean,
      noJobOpportunity: Boolean,
      familyConcern: Boolean,
      didNotLook: Boolean,
      healthRelated: Boolean,
      other: Boolean,
      lackExperience: Boolean
    },
    jobDetails: {
      occupation: String,
      lineOfBusiness: String,
      placeOfWork: String,
      firstJob: String,
      stayingReasons: {
        salariesBenefits: Boolean,
        careerChallenge: Boolean,
        specialSkill: Boolean,
        relatedToCourse: Boolean,
        proximity: Boolean,
        peerInfluence: Boolean,
        familyInfluence: Boolean,
        other: Boolean
      },
      jobRelatedToCourse: String,
      acceptingJobReasons: {
        salariesBenefits: Boolean,
        careerChallenge: Boolean,
        specialSkill: Boolean,
        proximity: Boolean,
        other: Boolean
      },
      changingJobReasons: {
        specialSkill: Boolean,
        relatedToCourse: Boolean,
        proximity: Boolean,
        peerInfluence: Boolean,
        familyInfluence: Boolean,
        other: Boolean
      },
      firstJobDuration: String,
      firstJobSearch: {
        advertisement: Boolean,
        walkIn: Boolean,
        recommended: Boolean,
        friends: Boolean,
        schoolPlacement: Boolean,
        familyBusiness: Boolean,
        jobFair: Boolean,
        other: Boolean
      },
      jobLandingTime: String,
      jobLevel: String,
      salaryRange: String,
      curriculumRelevant: String,
      competencies: {
        communication: Boolean,
        humanRelations: Boolean,
        entrepreneurial: Boolean,
        ITSkills: Boolean,
        problemSolving: Boolean,
        criticalThinking: Boolean,
        other: Boolean,
      }
    }
  },
  { 
    collection: "TracerSurvey2", // Explicitly set collection name
    timestamps: true 
  }
);

const TracerSurvey2 = mongoose.model("TracerSurvey2", TracerSurvey2Schema);
export default TracerSurvey2;