from fastapi import APIRouter, HTTPException, Query
from datetime import datetime, timedelta, timezone
import subprocess
import json
import asyncio

router = APIRouter()

CALENDARS = {
    "Family Stuff": "fvjbgorcnoar050nuno98m1dak@group.calendar.google.com",
    "SC Wave 2015 Girls Pre-GA": "ccfkp03urhdfr72e61pvh7a9u46dcnce@import.calendar.google.com",
    "Merton Mavericks Blue 12U": "ho2u8a2e3fjdqb5qiklsb59sv2lafron@import.calendar.google.com",
    "Merton Fillies 8U": "iigtnbti6emqfq62oco15defq5ri7f36@import.calendar.google.com",
    "Merton Fillies U10 Blue": "782b8d0ded3u37bn7cdnvmjopbn1h1cg@import.calendar.google.com",
    "US Holidays": "en.usa#holiday@group.v.calendar.google.com",
}

SPORTS_CALENDARS = {
    "SC Wave 2015 Girls Pre-GA",
    "Merton Mavericks Blue 12U",
    "Merton Fillies 8U",
    "Merton Fillies U10 Blue",
}


def fetch_calendar_events(calendar_id: str, cal_name: str, from_iso: str, to_iso: str):
    """Fetch events from a single calendar using gog CLI."""
    try:
        result = subprocess.run(
            ["gog", "calendar", "events", calendar_id,
             "--from", from_iso, "--to", to_iso, "--json", "--no-input"],
            capture_output=True, text=True, timeout=15
        )
        if result.returncode != 0:
            return []
        data = json.loads(result.stdout)
        events = data.get("events", [])
        # Tag each event with its calendar name
        for e in events:
            e["calendar"] = cal_name
            e["is_sports"] = cal_name in SPORTS_CALENDARS
        return events
    except Exception:
        return []


def normalize_event(e: dict) -> dict:
    """Normalize a gog event into a clean frontend-friendly dict."""
    start = e.get("start", {})
    end = e.get("end", {})
    start_str = start.get("dateTime") or start.get("date", "")
    end_str = end.get("dateTime") or end.get("date", "")

    return {
        "id": e.get("id", ""),
        "title": e.get("summary", "(No title)"),
        "start": start_str,
        "end": end_str,
        "location": e.get("location", ""),
        "description": e.get("description", ""),
        "calendar": e.get("calendar", ""),
        "is_sports": e.get("is_sports", False),
        "all_day": "date" in start and "dateTime" not in start,
    }


@router.get("/events")
def get_events(
    days: int = Query(default=14, ge=1, le=60)
):
    now = datetime.now(timezone.utc)
    from_iso = now.strftime("%Y-%m-%dT%H:%M:%SZ")
    to_iso = (now + timedelta(days=days)).strftime("%Y-%m-%dT%H:%M:%SZ")

    all_events = []
    for cal_name, cal_id in CALENDARS.items():
        events = fetch_calendar_events(cal_id, cal_name, from_iso, to_iso)
        all_events.extend(events)

    normalized = [normalize_event(e) for e in all_events]
    # Sort by start time
    normalized.sort(key=lambda e: e["start"])

    return {"events": normalized, "fetched_at": now.isoformat()}


@router.get("/carpool")
def get_carpool_recommendations(days: int = Query(default=7, ge=1, le=30)):
    """
    Look for same-day time conflicts between sports events and flag them
    as potential carpool situations.
    """
    now = datetime.now(timezone.utc)
    from_iso = now.strftime("%Y-%m-%dT%H:%M:%SZ")
    to_iso = (now + timedelta(days=days)).strftime("%Y-%m-%dT%H:%M:%SZ")

    sports_events = []
    for cal_name in SPORTS_CALENDARS:
        cal_id = CALENDARS[cal_name]
        events = fetch_calendar_events(cal_id, cal_name, from_iso, to_iso)
        sports_events.extend(events)

    if not sports_events:
        return {"message": "No upcoming sports events found.", "conflicts": []}

    # Group by date
    by_date: dict = {}
    for e in sports_events:
        start = e.get("start", {})
        start_str = start.get("dateTime") or start.get("date", "")
        if not start_str:
            continue
        date_key = start_str[:10]  # YYYY-MM-DD
        by_date.setdefault(date_key, []).append(e)

    conflicts = []
    for date, events in sorted(by_date.items()):
        if len(events) > 1:
            # Multiple sports events on the same day = potential carpool need
            event_summaries = [
                f"{e.get('summary', '?')} ({e.get('calendar', '?')}) at {e.get('start', {}).get('dateTime', '')[:16].replace('T', ' ')}"
                for e in events
            ]
            conflicts.append({
                "date": date,
                "events": event_summaries,
                "note": f"{len(events)} events on this day — you may need a second driver or carpool help.",
            })

    if not conflicts:
        msg = "No carpool conflicts detected in the next {} days. Schedules look manageable!".format(days)
    else:
        msg = f"Found {len(conflicts)} day(s) with overlapping sports events."

    return {"message": msg, "conflicts": conflicts}
