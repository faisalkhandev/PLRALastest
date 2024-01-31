from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .views import *
from rest_framework.routers import DefaultRouter
from .views import ModelListView, RecentActionsAPI, Routes

#creating router
router = DefaultRouter()
router.register("position", Positionapi, basename="Positions")
router.register("User", UserAPI, basename="users")
router.register("job", JobAPI, basename="Job")
router.register("center", CenterAPI, basename="center")
router.register("region", RegionAPI, basename="region")
router.register("wing", WingAPI, basename="wing")
router.register("subwing", SubWingAPI, basename="subwing")
router.register("Division", DivisionAPI, basename="Division")
router.register("District", DistrictAPI, basename="DistrictAPI")
router.register("employee_title", EmployeeTitleAPI, basename="employee_title")
router.register("tehsil", TehsilAPI, basename="tehsil")
router.register("positiontypes", PositionTypeAPI, basename="positiontypes")
router.register("ppglevelsetup", PpgLevelSetupAPI, basename="ppglevelsetup")
router.register("JobLevelapi", JobLevelAPI, basename="JobLevelapi")
router.register("JobLevelAssignmentAPI", JobLevelAssignmentAPI, basename="JobLevelAssignmentAPI")
router.register("PositionAssignmentAPI", PositionAssignmentAPI, basename="PositionAssignmentAPI")
router.register("JobLevelValidityAPI", JobLevelValidityAPI, basename="JobLevelValidityAPI")
router.register("ApprovalMatrixAPI", ApprovalMatrixAPI, basename="ApprovalMatrixAPI")
router.register("recent-actions", RecentActionsAPI, basename="recent-actions")
router.register("PermissionAPI", PermissionAPI, basename="PermissionAPI")
router.register("GroupAPI", GroupAPI, basename="GroupAPI")
router.register("NotificationAPI", NotificationAPI, basename="NotificationAPI")
urlpatterns = [
    path('', include(router.urls)),
    path('models/', ModelListView.as_view(), name='model-list'),
    path('routes/', Routes.as_view(), name='route-list'),
    # path('recent-action/', RecentActionsAPI, name='recent-actions'),
    # path('api-token-auth/', views.obtain_auth_token()),
    # path('positions/', views.obtain_auth_token),
    # path('positions/', Position),
    # path('positions/<int:pk>/', Position),

]