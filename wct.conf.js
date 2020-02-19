module.exports = {
    suites: ["test/**/*.html"],
    plugins: {
        local: {
            browsers: ['chrome']
        },
        sauce: {
            disabled: true
        },
        istanbub: {
            dir: "./coverage",
            reporters: ['text-summary', "lcov"],
            include: ['/src/**/*.js']
        }
    }
}