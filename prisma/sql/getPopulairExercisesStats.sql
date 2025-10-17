-- @param {String} $1:userId Current user ID
WITH top_exercises AS (
    SELECT "exerciseId"
    FROM "GymSet"
	JOIN "GymSession" gss ON "sessionId" = gss.id
	WHERE gss."userId" = $1
    GROUP BY "exerciseId"
    ORDER BY COUNT("exerciseId") DESC
    LIMIT 4
)
SELECT
	ge.name, 
    MAX(gs.weight) as weight, 
    gss."startDate"
FROM "GymSet" gs
JOIN top_exercises te ON gs."exerciseId" = te."exerciseId"
JOIN "GymExercise" ge ON gs."exerciseId" = ge.id
JOIN "GymSession" gss ON gs."sessionId" = gss.id
WHERE gss."userId" = $1
GROUP BY gss."startDate", ge.name
ORDER BY gss."startDate" ASC;