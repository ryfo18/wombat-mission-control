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
            dk_fastest_lap_pts, dk_total_pts
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
async def get_driver_trends(min_races: int = 3):
    """Get driver performance trends across races."""
    db = await get_db()
    cursor = await db.execute("""
        SELECT 
            driver,
            COUNT(*) as races,
            ROUND(AVG(dk_total_pts), 2) as avg_dk,
            MAX(dk_total_pts) as best,
            MIN(dk_total_pts) as worst,
            ROUND(AVG(finish_pos), 1) as avg_finish,
            ROUND(AVG(dk_pd_pts), 2) as avg_pd,
            ROUND(AVG(laps_led), 1) as avg_laps_led,
            SUM(laps_led) as total_laps_led
        FROM nascar_track_history
        WHERE track = 'Watkins Glen'
        GROUP BY driver
        HAVING races >= ?
        ORDER BY avg_dk DESC
    """, (min_races,))
    rows = await cursor.fetchall()
    await db.close()
    
    results = []
    for row in rows:
        results.append({
            "driver": row[0],
            "races": row[1],
            "avg_dk": row[2],
            "best": row[3],
            "worst": row[4],
            "avg_finish": row[5],
            "avg_pd": row[6],
            "avg_laps_led": row[7],
            "total_laps_led": row[8],
        })
    
    return results


@router.get("/race-years")
async def get_race_years():
    """Get list of available race years."""
    db = await get_db()
    cursor = await db.execute("""
        SELECT DISTINCT race_year FROM nascar_track_history 
        WHERE track = 'Watkins Glen'
        ORDER BY race_year DESC
    """)
    rows = await cursor.fetchall()
    await db.close()
    
    return [row[0] for row in rows]
