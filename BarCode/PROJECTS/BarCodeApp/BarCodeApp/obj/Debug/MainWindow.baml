   M S B A M L   `   `   `  ����]  YC1.WPF.BarCode.4, Version=4.0.20153.495, Culture=neutral, PublicKeyToken=2aa4ec5576d6c3ceA2clr-namespace:C1.BarCode;assembly=C1.WPF.BarCode.4
C1.BarCode  5   	    
BarCodeApp   BarCodeApp.MainWindow   5      R NWindowsBase, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35W SPresentationCore, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35\ XPresentationFramework, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35D 9http://schemas.microsoft.com/winfx/2006/xaml/presentation    5   	   R NSystem.Xaml, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089:x,http://schemas.microsoft.com/winfx/2006/xaml     5   	   U QC1.WPF.4, Version=4.0.20153.495, Culture=neutral, PublicKeyToken=2aa4ec5576d6c3ce:c1/http://schemas.componentone.com/winfx/2006/xaml    5   	   BBarCode2clr-namespace:C1.BarCode;assembly=C1.WPF.BarCode.4    5   	     � Title$  BarCode Sample��5   	   .��5	      �  � 	Resources 5   
    �� 
TargetType �� Property �� Value��%  '��       '�� M     '�� �     �� 5      " ��6   .�5      ��  � ��$ 18(�6-   6:   5      �� 5      " ��6   .�5      ��  � ��$ 18(�6-   6:   5      �� 5      " ��6   .�5      ��  � ��$ 18(�6-   6:   5      5      .+�5   
   �� $��Center=�6   ._�5      �  � RowDefinitions 5      �� 5      $	��20* �6$   �� 5      $	��20* �6$   �� 5      $	��60* �6$    � ColumnDefinitions 5      �� 5      $	��40* �6'   �� 5      $	��60* �6'   .+�5$   	   �� $��	CodeType:��6   $��Center=�6$   6A   �� 5%   
   -   5         ��Name$ 
cbCodeType��5%      $
��Left=�6(   $��1��6C   $	��414��6T   $��50��6`   �� 5&      $��Text:��6   $��1��6#   $��Center=�60   6M   �� 5'      -   5         ��Name$
 text��5'      $
��Left=�5(      $��1��6*   $��1��6:   $��50��6G   $	��414��6S   ��5'   $   �� *Text+	 �� ElementName$	 barcode��
 �� UpdateSourceTrigger$
 PropertyChanged=� �� FallbackValue$  �� �� Mode$ TwoWay=�5(   S   �� 5)      $��BarCode:��6   $��2��6*   $��Center=�67   � 5*      $��2��6   $��1��6   
�������$
��Left=�6A   $	��414��6\   5+      5,      5-         C1.WPF.BarCode.C1BarCode  51   
   -   5          Name$ barcode��51         AutoSize .     	BarHeight$ 0Q�69      CodeType$ QRCode=�6G      CaptionPosition$ Below=�6Y      Text$  http://www.compnentone.com��52      $	��200��69   $	��200��6F   $��315,249,245,55q�6R      QRCodeOptions 53         C1.BarCode.QRCodeOptions  54         
ErrorLevel$
 High=�6(   56      �� 5:   
   -   5         ��Name$ image��5;   	   $��Resources/c1logo.png��5:      $��70��5;      $��70��6#   $��378,310,312,124q�6/   5=      5>      