-- @param {String} $1:userId Current user ID
-- @param {DateTime} $2:startDate Start date of the period
-- @param {DateTime} $3:endDate End date of the period

SELECT mg.name, COUNT(*) AS "count"
FROM "GymSet" gs
JOIN "GymExercise" ge ON gs."exerciseId" = ge.id
JOIN "GymExerciseOnGymMuscleGroup" geomg ON ge.id = geomg."exerciseId"
JOIN "GymMuscleGroup" mg ON geomg."muscleGroupId" = mg.id
JOIN "GymSession" gsess ON gs."sessionId" = gsess.id
WHERE gsess."userId" = $1
AND gsess."startDate" >= $2
AND gsess."startDate" < $3
GROUP BY gsess.id, mg.name
ORDER BY "count" DESC
LIMIT 1