/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { LaunchesView } from './components/LaunchesView';
import { LandCalcView } from './components/LandCalcView';
import { ComparablesView } from './components/ComparablesView';
import { SavedReportsView } from './components/SavedReportsView';
import { PitchModal } from './components/PitchModal';
import { SiteDetailModal } from './components/SiteDetailModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { ProfileModal } from './components/ProfileModal';

import { INITIAL_GLS_SITES } from './data/glsSites';
import { INITIAL_NOTIFICATIONS } from './data/notifications';
import { GLSSite, SavedReport, NotificationItem } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('launches');
  
  // Forecaster parameters
  const [landCost, setLandCost] = useState<number>(1220);
  const [overheadCost, setOverheadCost] = useState<number>(420);
  const [marginPercent, setMarginPercent] = useState<number>(20);
  const [simulatedSite, setSimulatedSite] = useState<GLSSite | null>(null);

  // GLS sites & bookmarks
  const [sites] = useState<GLSSite[]>(INITIAL_GLS_SITES);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(() => {
    return new Set(['pine-grove-b', 'jalan-tembusu']);
  });
  const [isFilterSaved, setIsFilterSaved] = useState(false);

  // Saved Client Pitch Reports
  const [savedReports, setSavedReports] = useState<SavedReport[]>([
    {
      id: 'rep-1',
      siteName: 'Pine Grove (Parcel B)',
      district: 'D21',
      landPsf: 1223,
      breakevenPsf: 1650,
      projectedPsf: 'S$ 2,150 – S$ 2,320 PSF',
      dateCreated: '14 Oct 2024',
      clientTarget: 'Mr. & Mrs. Kenneth Tan (D21 Upgraders)',
      notes: 'Client looking for 3BR high floor unit under S$ 2.2M near Henry Park Primary.',
    },
    {
      id: 'rep-2',
      siteName: 'Jalan Tembusu Site',
      district: 'D15',
      landPsf: 1069,
      breakevenPsf: 1510,
      projectedPsf: 'S$ 2,420 – S$ 2,480 PSF',
      dateCreated: '10 Oct 2024',
      clientTarget: 'Dr. Raymond Lee (East Coast Investor)',
      notes: 'Targeting 2BR dual-key or prime facing for rental yield within 450m of Tanjong Katong MRT.',
    },
  ]);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Agent Profile details
  const [agentName, setAgentName] = useState('Lucas Tan');
  const [agencyName, setAgencyName] = useState('PropNex Realty');
  const [agentCea, setAgentCea] = useState('R058912A');

  // Modals state
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);
  const [activePitchSiteName, setActivePitchSiteName] = useState('Pine Grove (Parcel B)');
  const [detailSite, setDetailSite] = useState<GLSSite | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Toggle bookmark for a site
  const handleToggleBookmark = (siteId: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(siteId)) {
        next.delete(siteId);
      } else {
        next.add(siteId);
      }
      return next;
    });
  };

  const handleSimulateSite = (site: GLSSite) => {
    setSimulatedSite(site);
    setLandCost(site.landBidPsf);
    setActivePitchSiteName(site.name);
    if (currentTab !== 'launches') {
      setCurrentTab('launches');
    }
  };

  const handleResetSimulatedSite = () => {
    setSimulatedSite(null);
    setActivePitchSiteName('Custom GLS Simulation');
  };

  const handleOpenPitchModal = (report?: SavedReport) => {
    if (report) {
      setActivePitchSiteName(report.siteName);
      setLandCost(report.landPsf);
      setOverheadCost(report.breakevenPsf - report.landPsf || 420);
    } else if (simulatedSite) {
      setActivePitchSiteName(simulatedSite.name);
    }
    setIsPitchModalOpen(true);
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleSaveNewNote = (siteName: string, clientName: string, note: string) => {
    const breakeven = landCost + overheadCost;
    const lowPrice = Math.round((breakeven * 1.18) / 10) * 10;
    const highPrice = Math.round((breakeven * 1.25) / 10) * 10;

    const newRep: SavedReport = {
      id: `rep-${Date.now()}`,
      siteName,
      district: 'Singapore GLS',
      landPsf: landCost,
      breakevenPsf: breakeven,
      projectedPsf: `S$ ${lowPrice.toLocaleString()} – S$ ${highPrice.toLocaleString()} PSF`,
      dateCreated: new Date().toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' }),
      clientTarget: clientName,
      notes: note,
    };

    setSavedReports((prev) => [newRep, ...prev]);
  };

  const handleDeleteReport = (id: string) => {
    setSavedReports((prev) => prev.filter((r) => r.id !== id));
  };

  const bookmarkedSitesList = sites.filter((s) => bookmarkedIds.has(s.id));

  // Sync title when active site changes
  useEffect(() => {
    if (simulatedSite) {
      document.title = `${simulatedSite.name} Forecaster - PropLaunch SG`;
    } else {
      document.title = 'PropLaunch SG - URA & GLS Indicative Launch Price Forecaster';
    }
  }, [simulatedSite]);

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] font-['Hanken_Grotesk'] antialiased flex flex-col min-h-screen">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        unreadCount={unreadCount}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onToggleSaved={() => setIsFilterSaved((prev) => !prev)}
        isFilterSaved={isFilterSaved}
        savedCount={bookmarkedIds.size}
      />

      {/* Main Viewport Container */}
      <main className="flex flex-col relative w-full max-w-2xl mx-auto px-4 pt-20 pb-28 min-h-screen">
        {currentTab === 'launches' && (
          <LaunchesView
            sites={sites}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
            onOpenDetails={(site) => setDetailSite(site)}
            onGeneratePitch={() => handleOpenPitchModal()}
            landCost={landCost}
            onLandCostChange={setLandCost}
            overheadCost={overheadCost}
            onOverheadCostChange={setOverheadCost}
            marginPercent={marginPercent}
            onMarginPercentChange={setMarginPercent}
            simulatedSiteName={simulatedSite ? simulatedSite.name : null}
            onSetSimulatedSite={handleSimulateSite}
            onResetSimulatedSite={handleResetSimulatedSite}
            filterOnlySaved={isFilterSaved}
          />
        )}

        {currentTab === 'land-calc' && <LandCalcView />}

        {currentTab === 'comparables' && <ComparablesView />}

        {currentTab === 'saved-reports' && (
          <SavedReportsView
            bookmarkedSites={bookmarkedSitesList}
            savedReports={savedReports}
            onRemoveBookmark={handleToggleBookmark}
            onOpenSiteDetails={(site) => setDetailSite(site)}
            onOpenPitchModal={handleOpenPitchModal}
            onDeleteReport={handleDeleteReport}
            onSaveNewNote={handleSaveNewNote}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        savedCount={bookmarkedIds.size}
      />

      {/* 1-Page Agent Pitch PDF / Sheet Modal */}
      <PitchModal
        isOpen={isPitchModalOpen}
        onClose={() => setIsPitchModalOpen(false)}
        siteName={activePitchSiteName}
        landCost={landCost}
        overheadCost={overheadCost}
        marginPercent={marginPercent}
        agentName={agentName}
        agencyName={agencyName}
        agentCea={agentCea}
      />

      {/* GLS Site In-depth Detail Modal */}
      <SiteDetailModal
        site={detailSite}
        onClose={() => setDetailSite(null)}
        onSimulate={handleSimulateSite}
        isBookmarked={detailSite ? bookmarkedIds.has(detailSite.id) : false}
        onToggleBookmark={handleToggleBookmark}
      />

      {/* URA & GLS Live Alerts Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
      />

      {/* Agent Advisor Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        agentName={agentName}
        agencyName={agencyName}
        agentCea={agentCea}
        onSaveProfile={(name, agency, cea) => {
          setAgentName(name);
          setAgencyName(agency);
          setAgentCea(cea);
        }}
      />
    </div>
  );
}
