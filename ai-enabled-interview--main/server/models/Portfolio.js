const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        personal: {
            name: {
                type: String,
                default: "",
            },

            title: {
                type: String,
                default: "",
            },

            email: {
                type: String,
                default: "",
            },

            phone: {
                type: String,
                default: "",
            },

            location: {
                type: String,
                default: "",
            },

            github: {
                type: String,
                default: "",
            },

            linkedin: {
                type: String,
                default: "",
            },
        },

        summary: {
            type: String,
            default: "",
        },

        skills: [
            {
                type: String,
            },
        ],

        experience: [
            {
                company: String,
                role: String,
                duration: String,
                description: String,
            },
        ],

        projects: [
            {
                title: String,
                description: String,
                technologies: [String],
                github: String,
                live: String,
            },
        ],

        education: [
            {
                degree: String,
                institution: String,
                year: String,
                description: String,
            },
        ],

        certifications: [
            {
                type: String,
            },
        ],

        template: {
            type: String,
            default: "modern",
        },


        slug: {
            type: String,
            unique: true,
            sparse: true,
        },

        isPublished: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Portfolio", portfolioSchema);
