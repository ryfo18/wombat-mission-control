from fastapi import APIRouter, HTTPException
from db import get_db
from typing import List, Optional

router = APIRouter()


@router.get("/track-history")
async def get_track_history(track: str = "Watkins Glen"):
    """Get all race results for a specific track."""
    db = await get_db()
    cursor = await db.execute("""
        SELECT 
            race_year, track, race_name, total_laps, driver, finish_pos, start_pos,
            laps_led, fastest_laps, status, dk_finish_pts, dk_pd_pts, dk_laps_led_pts,
            dk_fastest_lap_pts, dk_total_pts, dk_salary
        FROM nascar_track_history
        WHERE track = ?
        ORDER BY race_year DESC, finish_pos ASC
    """, (track,))
    rows = await cursor.fetchall()
    await db.close()
    
    results = []
    for row in rows:
        results.append({
            "race_year": row[0],
            "track": row[1],
            "race_name": row[2],
            "total_laps": row[3],
            "driver": row[4],
            "finish_pos": row[5],
            "start_pos": row[6],
            "laps_led": row[7],
            "fastest_laps": row[8],
            "status": row[9],
            "dk_finish_pts": row[10],
            "dk_pd_pts": row[11],
            "dk_laps_led_pts": row[12],
            "dk_fastest_lap_pts": row[13],
            "dk_total_pts": row[14],
            "dk_salary": row[15],
        })
    
    return results


@router.get("/track-history/by-year/{year}")
async def get_history_by_year(year: int):
    """Get track history for a specific year."""
    db = await get_db()
    cursor = await db.execute("""
        SELECT 
            race_year, track, race_name, total_laps, driver, finish_pos, start_pos,
            laps_led, fastest_laps, status, dk_finish_pts, dk_pd_pts, dk_laps_led_pts,
            dk_fastest_lap_pts, dk_total_pts
        FROM nascar_track_history
        WHERE race_year = ?
        ORDER BY finish_pos ASC
    """, (year,))
    rows = await cursor.fetchall()
    await db.close()
    
    results = []
    for row in rows:
        results.append({
            "race_year": row[0],
            "track": row[1],
            "race_name": row[2],
            "total_laps": row[3],
            "driver": row[4],
            "finish_pos": row[5],
            "start_pos": row[6],
            "laps_led": row[7],
            "fastest_laps": row[8],
            "status": row[9],
            "dk_finish_pts": row[10],
            "dk_pd_pts": row[11],
            "dk_laps_led_pts": row[12],
            "dk_fastest_lap_pts": row[13],
            "dk_total_pts": row[14],
        })
    
    return results


@router.get("/driver-trends")
async def get_driver_trends(min_races: int = 1, track: str = "Watkins Glen"):
    """Get driver performance summary across last 5 races at the track."""
    db = await get_db()
    cursor = await db.execute("""
        WITH last5 AS (
            SELECT DISTINCT race_year
            FROM nascar_track_history
            WHERE track = ?
            ORDER BY race_year DESC
            LIMIT 5
        )
        SELECT
            driver,
            COUNT(*) as races,
            SUM(CASE WHEN finish_pos = 1 THEN 1 ELSE 0 END) as wins,
            SUM(CASE WHEN finish_pos <= 5 THEN 1 ELSE 0 END) as top5s,
            SUM(CASE WHEN finish_pos <= 10 THEN 1 ELSE 0 END) as top10s,
            ROUND(AVG(start_pos), 1) as avg_start,
            ROUND(AVG(finish_pos), 1) as avg_finish,
            SUM(laps_led) as total_laps_led
        FROM nascar_track_history
        WHERE track = ? AND race_year IN (SELECT race_year FROM last5)
        GROUP BY driver
        HAVING races >= ?
        ORDER BY wins DESC, top5s DESC, avg_finish ASC
    """, (track, track, min_races))
    rows = await cursor.fetchall()
    await db.close()

    results = []
    for row in rows:
        results.append({
            "driver": row[0],
            "races": row[1],
            "wins": row[2],
            "top5s": row[3],
            "top10s": row[4],
            "avg_start": row[5],
            "avg_finish": row[6],
            "total_laps_led": row[7],
        })

    return results


@router.get("/tracks")
async def get_tracks():
    """Get list of available tracks with metadata."""
    db = await get_db()
    cursor = await db.execute("""
        SELECT 
            track,
            COUNT(DISTINCT race_year) as years,
            MIN(race_year) as first_year,
            MAX(race_year) as last_year
        FROM nascar_track_history
        GROUP BY track
        ORDER BY track ASC
    """)
    rows = await cursor.fetchall()
    await db.close()

    return [
        {
            "name": row[0],
            "years": row[1],
            "first_year": row[2],
            "last_year": row[3],
        }
        for row in rows
    ]


@router.get("/race-years")
async def get_race_years(track: str = "Watkins Glen"):
    """Get list of available race years for a track."""
    db = await get_db()
    cursor = await db.execute("""
        SELECT DISTINCT race_year FROM nascar_track_history 
        WHERE track = ?
        ORDER BY race_year DESC
    """, (track,))
    rows = await cursor.fetchall()
    await db.close()

    return [row[0] for row in rows]


# ── Upcoming Race ─────────────────────────────────────────────────────────────

@router.get("/upcoming")
async def get_upcoming():
    """Get the current upcoming race."""
    db = await get_db()
    cursor = await db.execute("""
        SELECT id, race_name, track, track_type, race_date, lock_time,
               total_laps, race_miles, status
        FROM nascar_upcoming
        WHERE status IN ('upcoming', 'active')
        ORDER BY race_date DESC LIMIT 1
    """)
    row = await cursor.fetchone()
    await db.close()
    if not row:
        return None
    return {
        "id": row[0], "race_name": row[1], "track": row[2],
        "track_type": row[3], "race_date": row[4], "lock_time": row[5],
        "total_laps": row[6], "race_miles": row[7], "status": row[8],
    }

@router.get("/upcoming/lineups")
async def get_lineups():
    db = await get_db()
    cursor = await db.execute("""
        SELECT l.lineup_type, l.driver, l.dk_salary, l.proj_pts, l.ceiling,
               l.ownership, l.start_pos, l.archetype, l.rationale, l.sort_order,
               u.race_name, u.track, u.race_date, u.lock_time
        FROM nascar_lineups l
        JOIN nascar_upcoming u ON l.upcoming_id = u.id
        WHERE u.status IN ('upcoming','active')
        ORDER BY l.lineup_type, l.sort_order
    """)
    rows = await cursor.fetchall()
    await db.close()
    result = {"cash": [], "gpp": [], "meta": None}
    for r in rows:
        if result["meta"] is None:
            result["meta"] = {"race_name": r[10], "track": r[11], "race_date": r[12], "lock_time": r[13]}
        driver = {
            "driver": r[1], "dk_salary": r[2], "proj_pts": r[3],
            "ceiling": r[4], "ownership": r[5], "start_pos": r[6],
            "archetype": r[7], "rationale": r[8],
        }
        if r[0] == "cash":
            result["cash"].append(driver)
        elif r[0] == "gpp":
            result["gpp"].append(driver)
    return result

@router.get("/upcoming/analysis")
async def get_analysis():
    db = await get_db()
    cursor = await db.execute("""
        SELECT a.race_overview, a.track_notes, a.points_distribution,
               a.dominator_analysis, a.driver_tiers, a.strategy_notes, a.updated_at,
               u.race_name, u.track, u.race_date, u.lock_time, u.track_type, u.total_laps
        FROM nascar_analysis a
        JOIN nascar_upcoming u ON a.upcoming_id = u.id
        WHERE u.status IN ('upcoming','active')
        ORDER BY a.updated_at DESC LIMIT 1
    """)
    row = await cursor.fetchone()
    await db.close()
    if not row:
        return None
    return {
        "race_overview": row[0], "track_notes": row[1],
        "points_distribution": row[2], "dominator_analysis": row[3],
        "driver_tiers": row[4], "strategy_notes": row[5], "updated_at": row[6],
        "race_name": row[7], "track": row[8], "race_date": row[9],
        "lock_time": row[10], "track_type": row[11], "total_laps": row[12],
    }

@router.put("/upcoming/lineups")
async def upsert_lineups(data: dict):
    """Replace lineups for the current upcoming race."""
    db = await get_db()
    cursor = await db.execute(
        "SELECT id FROM nascar_upcoming WHERE status IN ('upcoming','active') ORDER BY race_date DESC LIMIT 1"
    )
    row = await cursor.fetchone()
    if not row:
        await db.close()
        raise HTTPException(status_code=404, detail="No upcoming race")
    upcoming_id = row[0]
    await db.execute("DELETE FROM nascar_lineups WHERE upcoming_id=?", (upcoming_id,))
    for lt in ("cash", "gpp"):
        for i, d in enumerate(data.get(lt, [])):
            await db.execute("""
                INSERT INTO nascar_lineups
                (upcoming_id, lineup_type, driver, dk_salary, proj_pts, ceiling,
                 ownership, start_pos, archetype, rationale, sort_order)
                VALUES (?,?,?,?,?,?,?,?,?,?,?)
            """, (upcoming_id, lt, d.get("driver"), d.get("dk_salary"),
                  d.get("proj_pts"), d.get("ceiling"), d.get("ownership"),
                  d.get("start_pos"), d.get("archetype"), d.get("rationale"), i))
    await db.commit()
    await db.close()
    return {"ok": True}

@router.put("/upcoming/analysis")
async def upsert_analysis(data: dict):
    """Replace analysis for the current upcoming race."""
    import datetime
    db = await get_db()
    cursor = await db.execute(
        "SELECT id FROM nascar_upcoming WHERE status IN ('upcoming','active') ORDER BY race_date DESC LIMIT 1"
    )
    row = await cursor.fetchone()
    if not row:
        await db.close()
        raise HTTPException(status_code=404, detail="No upcoming race")
    upcoming_id = row[0]
    await db.execute("DELETE FROM nascar_analysis WHERE upcoming_id=?", (upcoming_id,))
    await db.execute("""
        INSERT INTO nascar_analysis
        (upcoming_id, race_overview, track_notes, points_distribution,
         dominator_analysis, driver_tiers, strategy_notes, updated_at)
        VALUES (?,?,?,?,?,?,?,?)
    """, (upcoming_id,
          data.get("race_overview"), data.get("track_notes"),
          data.get("points_distribution"), data.get("dominator_analysis"),
          data.get("driver_tiers"), data.get("strategy_notes"),
          datetime.datetime.utcnow().isoformat()))
    await db.commit()
    await db.close()
    return {"ok": True}
