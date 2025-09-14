import React, { useState, useEffect } from 'react';
import './Dashboard.css'; // For basic styling

const initialDashboardData = {
  categories: [
    {
      id: 'cspmExecutiveDashboard',
      name: 'CSPM Executive Dashboard',
      widgets: [
        {
          id: 'cloudAccounts',
          name: 'Cloud Accounts',
          type: 'chart',
          data: 'Cloud Accounts Data - Connected: 2, Total: 2',
          icon: '📊'
        },
        {
          id: 'cloudAccountRiskAssessment',
          name: 'Cloud Account Risk Assessment',
          type: 'chart',
          data: 'Cloud Account Risk Assessment Data - Score: 9659',
          icon: '⚠️'
        }
      ],
    },
    {
      id: 'cwppDashboard',
      name: 'CWPP Dashboard',
      widgets: [
        {
          id: 'top5NamespaceSpecificAlerts',
          name: 'Top 5 Namespace Specific Alerts',
          type: 'text',
          data: 'No Graph data available!',
          icon: '🚨'
        },
        {
          id: 'workloadAlerts',
          name: 'Workload Alerts',
          type: 'text',
          data: 'No Graph data available!',
          icon: '🔔'
        }
      ],
    },
    {
      id: 'registryScan',
      name: 'Registry Scan',
      widgets: [
        {
          id: 'imageRiskAssessment',
          name: 'Image Risk Assessment',
          type: 'text',
          data: '1470 Total vulnerabilities',
          icon: '🔎'
        },
        {
          id: 'imageSecurityIssues',
          name: 'Image Security Issues',
          type: 'text',
          data: '2 Total images',
          icon: '🛡️'
        }
      ],
    },
  ],
  availableWidgets: [
    { id: 'cloudAccounts', name: 'Cloud Accounts', category: 'CSPM', icon: '📊' },
    { id: 'cloudAccountRiskAssessment', name: 'Cloud Account Risk Assessment', category: 'CSPM', icon: '⚠️' },
    { id: 'top5NamespaceSpecificAlerts', name: 'Top 5 Namespace Specific Alerts', category: 'CWPP', icon: '🚨' },
    { id: 'workloadAlerts', name: 'Workload Alerts', category: 'CWPP', icon: '🔔' },
    { id: 'imageRiskAssessment', name: 'Image Risk Assessment', category: 'Registry Scan', icon: '🔎' },
    { id: 'imageSecurityIssues', name: 'Image Security Issues', category: 'Registry Scan', icon: '🛡️' },
    { id: 'newWidgetImage', name: 'Image Widget', category: 'Image', icon: '🖼️' },
    { id: 'newWidgetTicket', name: 'Ticket Widget', category: 'Ticket', icon: '🎟️' }
  ]
};

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(initialDashboardData);
  const [showAddWidgetModal, setShowAddWidgetModal] = useState(false);
  const [selectedCategoryForAdd, setSelectedCategoryForAdd] = useState(null);
  const [newWidgetName, setNewWidgetName] = useState('');
  const [newWidgetText, setNewWidgetText] = useState('');
  const [showManageWidgetsModal, setShowManageWidgetsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const removeWidget = (categoryId, widgetId) => {
    setDashboard((prevDashboard) => {
      const updatedCategories = prevDashboard.categories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            widgets: category.widgets.filter((widget) => widget.id !== widgetId),
          };
        }
        return category;
      });
      return { ...prevDashboard, categories: updatedCategories };
    });
  };

  const handleOpenAddWidgetModal = (categoryId) => {
    setSelectedCategoryForAdd(categoryId);
    setShowAddWidgetModal(true);
  };

  const handleAddWidget = () => {
    if (!newWidgetName || !newWidgetText || !selectedCategoryForAdd) return;

    const newWidget = {
      id: `customWidget-${Date.now()}`, // Unique ID
      name: newWidgetName,
      type: 'text', // Assuming custom widgets are text-based for simplicity
      data: newWidgetText,
      icon: '➕' // Default icon for custom widgets
    };

    setDashboard((prevDashboard) => {
      const updatedCategories = prevDashboard.categories.map((category) => {
        if (category.id === selectedCategoryForAdd) {
          return {
            ...category,
            widgets: [...category.widgets, newWidget],
          };
        }
        return category;
      });

      const updatedAvailableWidgets = [...prevDashboard.availableWidgets, {
        id: newWidget.id,
        name: newWidget.name,
        category: prevDashboard.categories.find(cat => cat.id === selectedCategoryForAdd)?.name || 'Custom',
        icon: newWidget.icon
      }];

      return {
        ...prevDashboard,
        categories: updatedCategories,
        availableWidgets: updatedAvailableWidgets
      };
    });

    setNewWidgetName('');
    setNewWidgetText('');
    setShowAddWidgetModal(false);
    setSelectedCategoryForAdd(null);
  };

  const handleToggleWidgetInManageModal = (widgetId, isChecked, categoryId) => {
    setDashboard((prevDashboard) => {
      const updatedCategories = prevDashboard.categories.map((category) => {
        if (category.id === categoryId) {
          const widgetExists = category.widgets.some(w => w.id === widgetId);
          const widgetToAdd = prevDashboard.availableWidgets.find(w => w.id === widgetId);

          if (isChecked && !widgetExists && widgetToAdd) {
            return {
              ...category,
              widgets: [...category.widgets, { ...widgetToAdd, data: `Random data for ${widgetToAdd.name}` }],
            };
          } else if (!isChecked && widgetExists) {
            return {
              ...category,
              widgets: category.widgets.filter((widget) => widget.id !== widgetId),
            };
          }
        }
        return category;
      });
      return { ...prevDashboard, categories: updatedCategories };
    });
  };

  const filteredAvailableWidgets = dashboard.availableWidgets.filter(widget =>
    widget.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>CNAPP Dashboard</h1>
        <button onClick={() => setShowManageWidgetsModal(true)}>+ Add Widget</button>
      </header>

      {dashboard.categories.map((category) => (
        <section key={category.id} className="dashboard-category">
          <div className="category-header">
            <h2>{category.name}</h2>
            <button onClick={() => handleOpenAddWidgetModal(category.id)}>Add Custom Widget</button>
          </div>
          <div className="widgets-grid">
            {category.widgets.map((widget) => (
              <div key={widget.id} className="widget-card">
                <button className="remove-widget" onClick={() => removeWidget(category.id, widget.id)}>
                  &times;
                </button>
                <h3>{widget.icon} {widget.name}</h3>
                <p>{widget.data}</p>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Add Widget Modal */}
      {showAddWidgetModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New Widget to {dashboard.categories.find(c => c.id === selectedCategoryForAdd)?.name}</h2>
            <label>
              Widget Name:
              <input
                type="text"
                value={newWidgetName}
                onChange={(e) => setNewWidgetName(e.target.value)}
              />
            </label>
            <label>
              Widget Text:
              <textarea
                value={newWidgetText}
                onChange={(e) => setNewWidgetText(e.target.value)}
              ></textarea>
            </label>
            <div className="modal-actions">
              <button onClick={handleAddWidget}>Add Widget</button>
              <button onClick={() => setShowAddWidgetModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Widgets Modal */}
      {showManageWidgetsModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Personalise your dashboard by adding the following widget</h2>
            <div className="widget-search">
              <input
                type="text"
                placeholder="Search widgets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="widget-selection-tabs">
              {/* This part mimics the "CSPM", "CWPP", "Image", "Ticket" tabs */}
              {Array.from(new Set(dashboard.availableWidgets.map(w => w.category))).map(cat => (
                <span key={cat} className="widget-tab">{cat}</span>
              ))}
            </div>
            <div className="widget-list">
              {filteredAvailableWidgets.map((widget) => (
                <div key={widget.id} className="widget-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={dashboard.categories.some(category =>
                        category.widgets.some(w => w.id === widget.id)
                      )}
                      onChange={(e) =>
                        handleToggleWidgetInManageModal(
                          widget.id,
                          e.target.checked,
                          dashboard.categories.find(cat => cat.name === widget.category)?.id // Find category ID by name
                        )
                      }
                    />
                    {widget.name}
                  </label>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowManageWidgetsModal(false)}>Confirm</button>
              <button onClick={() => setShowManageWidgetsModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
