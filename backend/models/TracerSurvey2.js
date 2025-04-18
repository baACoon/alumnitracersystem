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
    education: {
      type: [{
        type: [String],
        college: [String],
        course: [String],
        yearGraduated: String,
        institution: String
      }],
      required: true
    },
    examinations: {
      type: [{
        examName: String,
        dateTaken: String,
        rating: String
      }],
      required: true
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
    trainings: {
      type: [{
        title: String,
        duration: String,
        institution: String
      }],
      required: true
    },
    motivation: {
      promotion: Boolean,
      professionalDevelopment: Boolean,
      others: String
    },
    employmentStatus: {
      type: String,
      enum: ["employed", "unemployed", "self-employed", "further-study"],
      required: true
    },
    unemploymentReasons: {
      furtherStudy: Boolean,
      noJobOpportunity: Boolean,
      familyConcern: Boolean,
      didNotLook: Boolean,
      healthRelated: Boolean,
      other: String,
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
        other: String
      },
      jobRelatedToCourse: String,
      acceptingJobReasons: {
        salariesBenefits: Boolean,
        careerChallenge: Boolean,
        specialSkill: Boolean,
        proximity: Boolean,
        other: String
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
        other: String
      },
      jobLandingTime: String,
      jobLevel: {
        rankClerical: { firstJob: Boolean, currentJob: Boolean },
        professionalSupervisory: { firstJob: Boolean, currentJob: Boolean },
        managerialExecutive: { firstJob: Boolean, currentJob: Boolean },
        selfEmployed: { firstJob: Boolean, currentJob: Boolean }
      },
      // salaryRange: String,
      // curriculumRelevant: String,
      // competencies: {
      //   communication: Boolean,
      //   humanRelations: Boolean,
      //   entrepreneurial: Boolean,
      //   ITSkills: Boolean,
      //   problemSolving: Boolean,
      //   criticalThinking: Boolean,
      //   other: String
      // },
      // curriculumSuggestions: String
    }
  },
  { 
    collection: "TracerSurvey2", // Explicitly set collection name
    timestamps: true 
  }
);

const TracerSurvey2 = mongoose.model("TracerSurvey2", TracerSurvey2Schema);
export default TracerSurvey2;