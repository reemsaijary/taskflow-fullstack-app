from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView

from tasks.models import Task


class DashboardStatsView(APIView):
    def get(self, request):
        tasks = Task.objects.filter(user=request.user)
        today = timezone.localdate()

        total_tasks = tasks.count()
        todo_tasks = tasks.filter(status=Task.Status.TODO).count()
        in_progress_tasks = tasks.filter(
            status=Task.Status.IN_PROGRESS
        ).count()
        completed_tasks = tasks.filter(
            status=Task.Status.COMPLETED
        ).count()

        overdue_tasks = tasks.filter(
            due_date__lt=today
        ).exclude(
            status=Task.Status.COMPLETED
        ).count()

        due_today = tasks.filter(
            due_date=today
        ).exclude(
            status=Task.Status.COMPLETED
        ).count()

        completion_rate = (
            round((completed_tasks / total_tasks) * 100, 1)
            if total_tasks > 0
            else 0
        )

        return Response(
            {
                "total_tasks": total_tasks,
                "todo_tasks": todo_tasks,
                "in_progress_tasks": in_progress_tasks,
                "completed_tasks": completed_tasks,
                "overdue_tasks": overdue_tasks,
                "due_today": due_today,
                "completion_rate": completion_rate,
            }
        )