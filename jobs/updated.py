from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from .jobs import sehedule_api,real_time

def start():
    
    scheduler = BackgroundScheduler()
    # scheduler.add_job(sehedule_api, 'cron', day='1', hour='0', minute='6')
    scheduler.add_job(real_time, 'interval',seconds=5)
    # scheduler.add_job(sehedule_api, 'interval',seconds=5)
    scheduler.start()

    # # Manually trigger the job
    # sehedule_api()

# Call the start function to begin scheduling the job
start()
