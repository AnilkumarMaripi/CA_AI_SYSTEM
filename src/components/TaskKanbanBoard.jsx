import React, { useState } from 'react';
import { LayoutGrid, UserPlus, CheckCircle2, Clock, AlertTriangle, ArrowRight, UserCheck } from 'lucide-react';

export default function TaskKanbanBoard({ tasks = [], users = [], onAssignTask, onUpdateStage }) {
  const [selectedUserFilter, setSelectedUserFilter] = useState('ALL');

  const filteredTasks = tasks.filter(t => {
    if (selectedUserFilter === 'ALL') return true;
    return (t.assigned_user_ids || []).includes(selectedUserFilter);
  });

  const stages = [
    { id: 'Pending', label: 'To Do (Pending)', color: 'border-slate-300 bg-slate-100 text-slate-700' },
    { id: 'In Progress', label: 'In Progress', color: 'border-cyan-300 bg-cyan-50 text-cyan-800' },
    { id: 'Review', label: 'Under Review', color: 'border-amber-300 bg-amber-50 text-amber-800' },
    { id: 'Filed', label: 'Done (Filed)', color: 'border-emerald-300 bg-emerald-50 text-emerald-800' }
  ];

  return (
    <div className="space-y-6 font-sans max-w-full">
      
      {/* Header & Staff Filter */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-emerald-600 shrink-0" />
            Task Kanban Board & Staff Allocation Workflow
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Assign compliance tasks to senior/junior staff and manage workflow stages.
          </p>
        </div>

        {/* Staff Filter Dropdown */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <span className="text-xs text-slate-600 font-bold uppercase tracking-wider shrink-0">Filter Staff:</span>
          <select
            value={selectedUserFilter}
            onChange={(e) => setSelectedUserFilter(e.target.value)}
            className="w-full md:w-auto bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500 min-h-[38px]"
          >
            <option value="ALL">All Practice Staff</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.full_name} ({u.role})</option>
            ))}
          </select>
        </div>
      </div>

      {/* 4 Kanban Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map(stage => {
          const columnTasks = filteredTasks.filter(t => (t.status || 'Pending') === stage.id);

          return (
            <div key={stage.id} className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 space-y-3 flex flex-col min-h-[300px] sm:min-h-[500px]">
              
              {/* Column Header */}
              <div className={`p-2.5 rounded-xl border font-bold text-xs flex items-center justify-between font-mono ${stage.color}`}>
                <span>{stage.label}</span>
                <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-800 text-[11px] font-bold shadow-xs">
                  {columnTasks.length}
                </span>
              </div>

              {/* Task Cards */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px] sm:max-h-[600px] pr-1">
                {columnTasks.map(task => (
                  <div key={task.id} className="bg-white border border-slate-200 p-4 rounded-xl space-y-3 hover:border-emerald-400 transition-all shadow-xs hover:shadow-sm">
                    
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border font-mono ${
                        task.category === 'GST' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' :
                        task.category === 'TDS' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {task.category}
                      </span>

                      {task.urgency === 'OVERDUE' && task.status !== 'Filed' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[9px] font-bold font-mono">
                          OVERDUE
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-xs leading-snug">{task.title}</h4>
                      <span className="text-[10px] text-slate-500 font-mono block mt-1">Client: {task.client_name}</span>
                    </div>

                    {/* Staff Assignment & Move Stage Controls */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1 text-[10px]">
                      
                      {/* Assign Staff Select */}
                      <select
                        value={task.assigned_user_ids && task.assigned_user_ids[0] ? task.assigned_user_ids[0] : ''}
                        onChange={(e) => {
                          if (e.target.value) onAssignTask(task.id, e.target.value);
                        }}
                        className="bg-slate-50 border border-slate-200 text-slate-700 rounded px-2 py-1 text-[10px] font-mono focus:outline-none max-w-[120px] min-h-[30px]"
                      >
                        <option value="">+ Staff</option>
                        {users.map(u => (
                          <option key={u.id} value={u.id}>{u.full_name.split(' ')[0]}</option>
                        ))}
                      </select>

                      {/* Move Stage Buttons */}
                      <div className="flex items-center space-x-1">
                        {stage.id !== 'Filed' && (
                          <button
                            onClick={() => {
                              const nextStage = stage.id === 'Pending' ? 'In Progress' : stage.id === 'In Progress' ? 'Review' : 'Filed';
                              onUpdateStage(task.id, nextStage);
                            }}
                            className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded font-bold transition-all min-h-[30px] flex items-center gap-1"
                            title="Advance Task Stage"
                          >
                            <span>Move</span> →
                          </button>
                        )}
                      </div>

                    </div>

                  </div>
                ))}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
